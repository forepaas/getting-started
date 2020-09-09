/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import FpDatastore from 'src/services/FpDatastore'
import FpDpe from 'src/services/FpDpe'
import useUndo from "./useUndo"
import { debounce } from "lodash"
import FpToaster from 'forepaas/toaster'
import LoadingBar from 'react-top-loading-bar'


import DataGrid from 'react-data-grid';
import { readRemoteFile, jsonToCSV } from 'react-papaparse'
import { useHotkeys } from 'react-hotkeys-hook';



const datastore = new FpDatastore()
const dpe = new FpDpe()


const EditableTable = ({ options }) => {
  const [columns, setColumns] = useState([])
  const { fileName, bucketName } = options
  const [meta, setMeta] = useState({})
  const [progressLoad, setProgressLoad] = useState(0)
  const [progressSave, setProgressSave] = useState(0)

  const [
    rowsState,
    {
      set: setRows,
      setSkipPast: setSkipPastRows, // allows to set rows without affecting the history (useful for sorting)
      reset: resetRows,
      undo: undoRows,
      redo: redoRows,
      canUndo,
      canRedo,
    },
  ] = useUndo([]);
  const { present: rows } = rowsState;


  /* Hotkeys */

  useHotkeys('cmd+z', () => undoRows(), [canUndo])
  useHotkeys('ctrl+z', () => undoRows(), [canUndo])

  useHotkeys('cmd+shift+z', () => redoRows(), [canRedo])
  useHotkeys('ctrl+shift+z', () => redoRows(), [canRedo])

  useHotkeys('cmd+shift+s', () => saveRows(), [progressSave, progressLoad, rows])
  useHotkeys('ctrl+shift+s', () => saveRows(), [progressSave, progressLoad, rows])

  /* Default columns properties */

  const defaultColumnProperties = {
    sortable: true,
    editable: true,
    resizable: true,
  };

  /* Default columns : actions column (allows to add/remove rows) */
  const defaultColumns = [{ key: "actions", name: "", width: 60 }]


  /* Load a file from the datastore, uses the buckerName and the fileName provided in the options */
  const loadDatasheet = (bucketName, fileName) => {
    readRemoteFile(datastore.getObjectDownloadUrl(bucketName, fileName), {
      header: true,
      beforeFirstChunk: (...args) => { setProgressLoad(0) },
      complete: (results) => {
        console.log(results)
        setProgressLoad(80)
        resetRows(results.data.map((result, _index) => { return { _id: _index, _index, ...result } }))
        setMeta(results.meta)
        setColumns([...defaultColumns, ...results.meta.fields.map(field => { return { "key": field, "name": field, ...defaultColumnProperties } })])
        setProgressLoad(100)
      },
      error: (error) => {
        resetRows([])
        setMeta({})
        setColumns([])
        setProgressLoad(100)
      }
    })
  }

  /* Load a new file from the datastore each time the bucketName or the fileName changes */
  useEffect(() => loadDatasheet(bucketName, fileName), [bucketName, fileName])

  const sortRows = (initialRows, sortColumn, sortDirection) => {
    const comparer = (a, b) => {
      if (sortDirection === "ASC") {
        return a[sortColumn] > b[sortColumn] ? 1 : -1;
      } else if (sortDirection === "DESC") {
        return a[sortColumn] < b[sortColumn] ? 1 : -1;
      }
    };
    return sortDirection === "NONE" ? sortRows(initialRows, "id", "ASC") : [...initialRows].sort(comparer);
  };

  const setRowsAfterSort = (sortColumn, sortDirection) => {
    const newRows = sortRows(rows, sortColumn, sortDirection).map((row, _index) => { return { ...row, _index } })
    setSkipPastRows(newRows)
  }

  const saveRows = async () => {
    setProgressSave(0)
    let rowsToSave = sortRows(rows, "", "NONE").map(({ _id, __index, ...rest }) => rest)
    const textCSV = jsonToCSV(rowsToSave, meta)
    let contentType = 'text/csv';
    let csvFile = new Blob([textCSV], { type: contentType });
    await datastore.uploadObject({ filename: fileName, bucket: bucketName }, csvFile, onProgress)
  }

  const onProgress = (progress) => {
    setProgressSave(progress.percentage * 100)
    if (progress.percentage === 1) {
      FpToaster.success(`Successfully saved ${fileName} in the bucket ${bucketName}`)
    }
  }


  const cellActions = (column, row) => {
    return column.key === "actions" &&
      [{
        icon: "fa fa-remove",
        callback: () => {
          deleteRow(row)
        }
      },
      {
        icon: "fa fa-plus",
        actions: [
          {
            text: "Insert Before",
            callback: () => {
              setRows(insertRow(row._index))
            }
          },
          {
            text: "Insert After",
            callback: () => {
              setRows(insertRow(row._index + 1))
            }
          }
        ]
      }]
  }

  const deleteRow = (rowToDelete) => {
    let updatedRows = [...rows]
    updatedRows = updatedRows.filter(row => row._id !== rowToDelete._id)
    setRows(updatedRows)
  }

  const insertRow = rowIdx => {
    const newId = rowIdx !== 0 ? rowIdx < rows.length ? (rows[rowIdx - 1]._id + rows[rowIdx]._id) / 2 : rows.length : -1
    let newRow = Object.fromEntries(Object.entries(rows[0]).map(([key, value]) => [key, ""]));
    newRow = { ...newRow, _id: newId }
    let nextRows = [...rows];
    nextRows.splice(rowIdx, 0, newRow);
    nextRows = nextRows.map((row, _index) => { return { ...row, _index } })
    return nextRows;
  };

  const onGridRowsUpdated = debounce(({ fromRow, toRow, updated }) => {
    const updatedRows = rows.slice();
    for (let i = fromRow; i <= toRow; i++) {
      updatedRows[i] = { ...updatedRows[i], ...updated };
    }
    setRows(updatedRows)
  }, 100)

  return (
    <div>
      <LoadingBar
        color='#00CCF9'
        progress={progressLoad}
        onLoaderFinished={() => setProgressLoad(0)}
      />
      <LoadingBar
        color='#00CCF9'
        progress={progressSave}
        onLoaderFinished={() => setProgressSave(0)}
      />
      {(columns.length > 0 && rows.length > 0) &&
        <div>
          <div className="toolbar">
            <div className="left-toolbar">
              <button disabled={!canUndo} onClick={undoRows}><i className="fa fa-undo"></i></button>
              <button disabled={!canRedo} onClick={redoRows}><i className="fa fa-undo" style={{ transform: "scaleX(-1)" }}></i></button>
              <div className="chart-title">{bucketName}/{fileName}</div>
            </div>
            <div className="right-toolbar">
              <button disabled={progressSave > 0} onClick={saveRows}><i className={progressSave > 0 ? "fa fa-spinner fa-spin" : "fa fa-save"}></i></button>
            </div>
          </div>
          <DataGrid
            columns={columns}
            rowGetter={i => rows[i]}
            rowsCount={rows.length}
            onGridSort={(sortColumn, sortDirection) =>
              setRowsAfterSort(sortColumn, sortDirection)
            }
            onGridRowsUpdated={onGridRowsUpdated}
            enableCellSelect={true}
            getCellActions={cellActions}
            minHeight={325}
          />
        </div>}
    </div >)
}

EditableTable.propTypes = {}
export default EditableTable
