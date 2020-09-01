import React, { useEffect, useState } from 'react'
import { Map as LeafletMap, CircleMarker, Popup, TileLayer } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import { FpMeasure } from 'forepaas/formatter'
// import PropTypes from 'prop-types'

const flattenChartResults = results => {
  let flattenedChartResults = []
  results.forEach(result => {
    let fieldEntries = []
    Object.entries(result.data).forEach(([fieldName, computeModes]) => {
      Object.entries(computeModes).forEach(([computeModeName, rows]) => {
        computeModeName === 'select'
          ? fieldEntries.push([computeModeName, rows[0].value])
          : fieldEntries.push([`${fieldName}_${computeModeName}`, rows[0].value])
      })
    })
    let flattenedObject = {
      ...result.scales,
      ...Object.fromEntries(fieldEntries)
    }
    flattenedChartResults.push(flattenedObject)
  })
  return flattenedChartResults
}

const ChartMap = (props) => {
  const [stations, setStations] = useState([])
  const center = [41.89, -87.6297982]
  const zoom = 14
  const minZoom = 7

  useEffect(() => {
    const results = flattenChartResults(props.chart.data.results)
    setStations(results)
  }, [props.chart.data.results])

  return (
    <LeafletMap center={center} zoom={zoom} minZoom={minZoom}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      />
      <MarkerClusterGroup showCoverageOnHover={false}>
        {stations.map(station => (
          <CircleMarker
            key={station.station_id}
            center={[station.lat, station.lng]}
            radius={Math.max(10 + station.rides_avg / 1000 * Math.log(zoom),
              2 * station.rides_avg / 1000 * Math.log(zoom))}
            color={'#0089C0'}
            weight={1}
            fillColor={'rgba(0,204,249,0.5)'}
          >
            <Popup closeButton={false} position={[station.lat, station.lng]}>
              <div className='popup-title'>{station.station_name}</div>
              <div className='popup-value'>{new FpMeasure('rides').setValue(station.rides_avg).toString()}</div>
            </Popup>
          </CircleMarker>
        ))}
      </MarkerClusterGroup>
    </LeafletMap>
  )
}

ChartMap.propTypes = {}
export default ChartMap
