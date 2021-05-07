import React from 'react'
import {render} from 'react-dom'
import FpSdk from '../forepaas/sdk'

FpSdk.start()
  .then(() => {
    var FpAppTemplate = FpSdk.modules.sdk.templates.default

    require('./my-dashboard.jsx')
    require('./styles.less')
    var FpModal = FpSdk.modules.modal

    class App extends React.Component {
      constructor (props) {
        super(props)
        this.state = {
          showModal: true
        }
        this.closeModal = this.closeModal.bind(this)
      }
      closeModal () {
        this.setState({
          showModal: false
        })
      }
      render () {
        return (
          <div>
            <FpAppTemplate />
            <FpModal show={this.state.showModal}>
              <FpModal.Header>
              Header
                <button onClick={this.closeModal}>X</button>
              </FpModal.Header>
              <FpModal.Body>
              Body
              </FpModal.Body>
              <FpModal.Footer>
              Footer
              </FpModal.Footer>
            </FpModal>
          </div>
        )
      }
    }
    render(<App />, document.getElementById('root'))
  })
