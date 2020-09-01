import React, { useEffect, useState } from 'react'
import FpDatastore from 'src/services/FpDatastore'
import 'react-keyed-file-browser/dist/react-keyed-file-browser.css';
import FileBrowser, { Icons } from 'react-keyed-file-browser'
// import PropTypes from 'prop-types'

const FileExplorer = () => {
  const [files, setFiles] = useState([])
  const setFilesFromBuckets = (buckets) => {
    const files = buckets.map(bucket => bucket.objects)
    console.log(files)
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
  console.log(files)

  return (
    <FileBrowser
      files={files.flat()}
      icons={Icons.FontAwesome(4)}
    />

  )
}

FileExplorer.propTypes = {}
export default FileExplorer
