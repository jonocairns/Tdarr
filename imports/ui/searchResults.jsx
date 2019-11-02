
import React, { Component } from 'react';
import ItemButton from './item_Button.jsx'
import Modal from "reactjs-popup";
import ReactTable from "react-table";
import { Button } from 'react-bootstrap';
import { renderToString } from 'react-dom/server'
import { Markup } from 'interweave';

const buildHeader = (title) => (
  <span>{title}</span>
);

export default class App extends Component {
  renderResults(data) {

    if (data.length == 0) {
      return <center><p>No results</p></center>
    } else {
      var getColumnWidth = (rows, accessor, headerText) => {
        var maxWidth = 400
        var magicSpacing = 10
        var cellLength = Math.max(
          ...rows.map(row => (`${row[accessor]}` || '').length),
          headerText.length,
        )
        return Math.min(maxWidth, cellLength * magicSpacing)
      }

      var columns = [
        {
          Header: () => buildHeader('File'),
          accessor: 'file',
          width: getColumnWidth(data, 'file', 'File'),
        },

        {
          Header: () => buildHeader('Streams'),
          id: 'streams',
          accessor: row => {
            if (!row.ffProbeData || !row.ffProbeData.streams) return null;

            var streams = row.ffProbeData.streams
            streams = streams.map((row) => {
              return (
                <tr>
                  <td width="20%">{row.codec_name}</td>
                  <td width="20%">{row.codec_type}</td>
                  <td width="20%">{row.bit_rate != undefined ? parseFloat((row.bit_rate / 1000000).toPrecision(4)) + " Mbs" : "-"}</td>
                  <td width="20%">{row.tags != undefined && row.tags.language != undefined ? row.tags.language : "-"}</td>
                  <td width="20%">{row.tags != undefined && row.tags.title != undefined ? row.tags.title : "-"}</td>
                </tr>
              )
            })

            return <table className="streamsTable" minWidth="400">
              <tbody>
                {streams}
              </tbody>
            </table>

          },
        },
        {
          Header: () => buildHeader('Codec'),
          accessor: 'video_codec_name',
          width: getColumnWidth(data, 'video_codec_name', 'Codec'),
        },
        {
          Header: () => buildHeader('Resolution'),
          accessor: 'video_resolution',
          width: getColumnWidth(data, 'video_resolution', 'Resolution'),
        },
        {
          Header: () => buildHeader('Size(GB)'),
          id: 'size',
          accessor: row => row.file_size != undefined ? parseFloat((row.file_size / 1000).toPrecision(4)) : 0,
        },
        {
          Header: () => buildHeader('Bitrate(Mbs)'),
          id: 'Bitrate',
          accessor: row => row.bit_rate != undefined ? parseFloat((row.bit_rate / 1000000).toPrecision(4)) : 0,
        },
        {
          Header: () => buildHeader('Duration(s)'),
          id: 'Duration',
          accessor: row => row.ffProbeData && row.ffProbeData.streams[0]["duration"] ? parseFloat((row.ffProbeData.streams[0]["duration"])) : 0,
        },
        {
          Header: () => buildHeader('Bump'),
          id: 'Bump',
          width: 'Bump'.length * 10,
          accessor: row => !(row.bumped instanceof Date) ? this.renderBumpButton(row.file) : this.renderCancelBumpButton(row.file),

        },
        {
          Header: () => buildHeader('Create sample'),
          id: 'Create sample',
          width: 'Create sample'.length * 10,
          accessor: row => this.renderCreateSampleButton(row.file),

        },

        {
          Header: () => buildHeader('Transcode'),
          id: 'Transcode',
          width: 'Transcode'.length * 10,
          accessor: row => row.TranscodeDecisionMaker == "Queued" ? "Queued(" + row.tPosition + ")" : this.renderRedoButton(row.file, 'TranscodeDecisionMaker'),
        },

        {
          Header: () => buildHeader('Health check'),
          id: 'Health check',
          width: 'Health check'.length * 10,
          accessor: row => row.HealthCheck == "Queued" ? "Queued(" + row.hPosition + ")" : this.renderRedoButton(row.file, 'HealthCheck'),
        },
        {
          Header: () => buildHeader('Info'),
          id: 'Info',
          width: 'Info'.length * 10,
          accessor: row => this.renderInfoButton(row),
        },
        {
          Header: () => buildHeader('History'),
          id: 'History',
          width: 'History'.length * 10,
          accessor: row => this.renderHistoryButton(row),
        },
      ]

      const filterMethod = (filter, row) => {
        if (filter.id == "streams") {
          var text = renderToString(row[filter.id])
          if ((text).toString().includes(filter.value)) {
            return true
          }
        } else {
          if ((row[filter.id]).toString().includes(filter.value)) {
            return true
          }
        }
      }


      return (
          <ReactTable
            className="bg-light text-dark"
            data={data}
            columns={columns}
            defaultPageSize={20}
            pageSizeOptions={[5, 10, 20, 25, 50, 100]}
            filterable={true}
            defaultFilterMethod={(filter, row) => filterMethod(filter, row)}
          />
      )
    }
  }


  renderBumpButton(file) {
    var obj = {
      bumped: new Date(),
    }
    return <ItemButton file={file} obj={obj} symbol={'↑'} type="updateDBAction" />
  }

  renderCancelBumpButton(file) {
    var obj = {
      bumped: false,
    }
    return <ItemButton file={file} obj={obj} symbol={'X'} type="updateDBAction" />
  }

  renderCreateSampleButton(file) {
    return <ItemButton file={file} symbol={'✄'} type="createSample" />
  }

  renderRedoButton(file, mode) {
    var obj = {
      [mode]: "Queued",
      processingStatus: false,
      createdAt: new Date(),
    }

    return <ItemButton file={file} obj={obj} symbol={'↻'} type="updateDBAction" />
  }

  renderIgnoreButton(file, mode) {

    var obj = {
      [mode]: "Ignored",
      processingStatus: false,
      createdAt: new Date(),
    }
    return <ItemButton file={file} obj={obj} symbol={'Ignore'} type="updateDBAction" />
  }

  renderInfoButton(row) {
    var result = []

    eachRecursive(row)

    function eachRecursive(obj) {
      for (var k in obj) {
        if (typeof obj[k] == "object" && obj[k] !== null) {
          eachRecursive(obj[k]);
        } else {
          result.push(k + ":" + obj[k])
        }
      }
    }

    result = result.map(row => <p>{row}</p>);

    return <Modal
      trigger={<Button variant="secondary" ><span className="buttonTextSize">i</span></Button>}
      modal
      closeOnDocumentClick
    >
      <div className="modalContainer">
        <div className="frame">
          <div className="scroll">
            <div className="modalText">
              {result}

            </div>
          </div>
        </div>
      </div>
    </Modal>
  }


  renderHistoryButton(row) {
    if (row.history == undefined) {
      result = '';
    } else {
      var result = row.history
      result = result.split("\n")
      result = result.map((row, i) => <Markup content={row} />);
    }


    return <Modal
      trigger={<Button variant="secondary" ><span className="buttonTextSize">H</span></Button>}
      modal
      closeOnDocumentClick
    >
      <div className="modalContainer">
        <div className="frame">
          <div className="scroll">
            <div className="modalText">
              {result}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  }

  render() {
    return this.renderResults(this.props.results)
  }
}