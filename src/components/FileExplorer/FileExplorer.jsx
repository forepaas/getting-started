import React, { useEffect, useState } from 'react'
import FpDatastore from 'src/services/FpDatastore'
import { FileBrowser, FileList, FileSearch, FileToolbar } from 'chonky';

// import PropTypes from 'prop-types'

const FileExplorer = () => {
  const [files, setFiles] = useState([])
  const setFilesFromBuckets = (buckets) => {
    const files = buckets.map(bucket => bucket.objects)
    setFiles(files)
  }
  useEffect(() => {
    const getBuckets = async () => {
      const datastore = new FpDatastore()
      const buckets = await datastore.listBuckets({ withObjects: true })
      setFilesFromBuckets(buckets)
      return buckets
    }
    getBuckets()
  }, [])

  return (
    <FileBrowser files={files} >
      <FileToolbar />
      <FileSearch />
      <FileList />
    </FileBrowser>
  )
}

FileExplorer.propTypes = {}
export default FileExplorer
