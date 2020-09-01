/**
 * Provides services to access ForePaaS DataStore
 */
import path from "path";
import { get, cloneDeep, camelCase } from "lodash";

import FpSdk from "forepaas/sdk";
import FpXhr from "forepaas/xhr";
import FpClientAuthorityManager from "forepaas/client-authority-manager";
import store from "forepaas/store";

/* some more specific libraries
 ** yarn add xml2js js-sha256 mustache moment
 */
import { parseString } from "xml2js";
import sha256 from "js-sha256";
import Mustache from "mustache";
import moment from "moment";

/*
Class FpDataStore provides an access to ForePaas DataStore
*/
/**
 *
 *
 * @class FpDataStore
 * @extends {FpXhr}
 */
class FpDataStore extends FpXhr {
  /* getters */
  get localSession() {
    try {
      return JSON.parse(
        localStorage.getItem("client-authority-manager-session")
      );
    } catch (_) {
      return null;
    }
  }
  get token() {
    return this.localSession && this.localSession.token;
  }
  get datastoreUrl() {
    if (FpSdk.config.datastore) {
      return FpSdk.config.datastore;
    }
    if (FpSdk.config.api) {
      const url = new URL(FpSdk.config.api);
      return `${url.protocol}//${url.hostname}/datastore`;
    }
    return null;
  }

  get appId() {
    return FpClientAuthorityManager.FpAuthentication.getAppId();
  }
  /*
   ** ForePaaS DataStaore API
   */

  async listBuckets(options = {}) {
    const response = await this.request({
      url: ""
    });
    let buckets = [];
    try {
      buckets = await response["listAllMyBucketsResult"]["buckets"][0][
        "bucket"
      ].slice(2);
      buckets.map(bucket =>
        Object.keys(bucket).forEach((key, index) => {
          bucket[key] = bucket[key][0];
        })
      );
      if (options.withObjects === true) {
        buckets = await Promise.all(
          buckets.map(async bucket => {
            try {
              const objects = await this.listObjects(bucket.name);
              return {
                ...bucket,
                objects
              };
            } catch (e) {
              console.error(e);
              return { ...bucket, objects: [] };
            }
          })
        );
      }
    } catch (e) {
      console.error(e);
    }
    return buckets;
  }

  listObjects(bucket) {
    return this.listObjectsRecursive(bucket).then(files => {
      if (!files) return [];
      return files.map(object => {
        return {
          percent: 1,
          filename: object.key[0],
          key: `${bucket}/${object.key[0]}`,
          modified: object.lastModified[0],
          size: parseInt(object.size[0]),
          bucket,
          downloadUrl: this.getObjectDownloadUrl(bucket, object.key[0])
        };
      });
    });
  }

  async listObjectsRecursive(bucket, token, files = []) {
    const response = await this.request({
      url: bucket,
      params: {
        "max-keys": 250,
        "list-type": 2,
        "continuation-token": token
      }
    });
    if (
      !response.listBucketResult.nextContinuationToken ||
      !response.listBucketResult.nextContinuationToken[0]
    ) {
      return response.listBucketResult.contents
        ? Promise.resolve(files.concat(response.listBucketResult.contents))
        : Promise.resolve(files);
    }
    return this.listObjectsRecursive(
      bucket,
      response.listBucketResult.nextContinuationToken[0],
      files.concat(response.listBucketResult.contents)
    );
  }

  getObjectDownloadUrl(bucket, filename) {
    return `${this.datastoreUrl}/${bucket}/${filename}?token=${this.token}&type=cam&app_id=${this.appId}`;
  }

  uploadObject(definition, file, onProgress = null) {
    let bucket = definition.bucket;
    let filename = definition.filename;
    console.log(bucket);
    console.log(filename);

    // // Replace extension if not .xlsx
    // let fileNameSplit = filename.split('.')
    // const fileNameSplitExtension = fileNameSplit.pop()
    // fileNameSplit = fileNameSplit.join('.')
    // const fileExtension = file.name.split('.').pop()
    // if (fileExtension !== fileNameSplitExtension) {
    //   filename = `${fileNameSplit}.${fileExtension}`
    // }

    // // Check for asian characters
    // const regexpKorean = /[\uac00-\ud7af]|[\u1100-\u11ff]|[\u3130-\u318f]|[\ua960-\ua97f]|[\ud7b0-\ud7ff]/g
    // if (filename.match(regexpKorean)) {
    //   filename = filename.replace(regexpKorean, '')
    // }

    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.onload = event => {
        let hasher = sha256.create();
        hasher.update(event.target.result);
        let hash = hasher.hex();
        let user = cloneDeep(
          get(store.getState(), "local['client-authority-manager-session']")
        );
        user.groups = user.groups.map(group => group.name);
        let headers = {
          "X-Amz-Meta-Original-File-Name": file.name,
          "X-Amz-Meta-Author": user.uid,
          "X-Amz-Content-SHA256": hash
        };
        let meta = definition.metadata || [];
        for (let key in meta) {
          headers["X-Amz-Meta-" + key] = Mustache.to_html(meta[key], {
            file,
            date: moment().format("YYYY-MM-DD"),
            datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
            user
          });
        }

        return this.put({
          onUploadProgress: progressEvent => {
            if (onProgress) {
              onProgress({
                percentage: progressEvent.loaded / progressEvent.total,
                loaded: progressEvent.loaded,
                total: progressEvent.total
              });
            }
          },
          url: path.join(bucket, filename),
          data: file,
          headers: headers
        })
          .then(() => {
            resolve();
          })
          .catch(reject);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  removeObject(bucket, filename) {
    return this.delete({
      url: path.join(bucket, filename)
    });
  }

  /*
   ** Helpers functions
   */
  parseXml(data) {
    // use xml2js parseString to render a JSON object from an XML document
    return new Promise((resolve, reject) => {
      parseString(
        data,
        {
          tagNameProcessors: [camelCase]
        },
        (err, result) => {
          if (err) return reject(err);
          return resolve(result);
        }
      );
    });
  }

  request(options) {
    options.baseURL = this.datastoreUrl;
    options.queryString = options.queryString || {};
    options.queryString.type = "cam";
    options.transformResponse = data => {
      if (data.indexOf("<?xml") === 0) return this.parseXml(data);
      return data;
    };
    return super
      .request(options)
      .then(res => {
        return res.data;
      })
      .catch(err => {
        throw err;
      });
  }
}

export default FpDataStore;
