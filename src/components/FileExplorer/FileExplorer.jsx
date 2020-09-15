import React, { useEffect, useState, useMemo, useCallback } from 'react'
import FpDatastore from 'src/services/FpDatastore'

// yarn add react-keyed-file-browser file-saver
import 'react-keyed-file-browser/dist/react-keyed-file-browser.css';
import FileBrowser, { Icons } from 'react-keyed-file-browser'
import FileSaver from 'file-saver'


import EditableTable from "../EditableTable"

const datastore = new FpDatastore()


const fetcher = (...args) => fetch(...args).then(res => res.blob())

const FileExplorer = () => {
  const [files, setFiles] = useState([])
  const [loadingFiles, setLoadingFiles] = useState(false)
  const setFilesFromBuckets = (buckets) => {
    const files = buckets.map(bucket => bucket.objects).flat()
    setFiles(files)
  }
  const getBuckets = useCallback(async () => {
    setLoadingFiles(true)
    const buckets = await datastore.listBuckets({ withObjects: true })
    setFilesFromBuckets(buckets)
    setLoadingFiles(false)
    return buckets
  }, [])

  useEffect(() => {
    getBuckets()
  }, [getBuckets])


  const handleDownloadFile = async (fileKeys) => {
    fileKeys.forEach(async fileKey => {
      const splittedFileKey = fileKey.split('/')
      const blob = await fetcher(datastore.getObjectDownloadUrlByFilekey(fileKey))
      FileSaver.saveAs(blob, splittedFileKey[splittedFileKey.length - 1])
    })
  }


  return (
    <FileBrowser
      files={files}
      icons={Icons.FontAwesome(4)}
      onDownloadFile={handleDownloadFile}
      detailRenderer={({ file }) => <EditableTable options={{ fileName: file.name, bucketName: file.key.split("/")[0] }} />}
      noFilesMessage={loadingFiles ? <div className="spinner-container"><i className="fa fa-spinner fa-spin" style={{fontSize: 40}}></i></div> : <div className="spinner-container">No files.</div>}
    />

  )
}

FileExplorer.propTypes = {}

export default FileExplorer
