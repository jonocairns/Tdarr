import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Button } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import Checkbox from '@material-ui/core/Checkbox';





var ButtonStyle = {
  display: 'inline-block',
}



class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      handBrakeMode: true,
      FFmpegMode: false

    };


  }


  createPlugin = () => {


    var preset = ReactDOM.findDOMNode(this.refs.preset).value

    var container = ReactDOM.findDOMNode(this.refs.container).value

    if (container.charAt(0) !== ".") {

      container = "." + container

    }


    Meteor.call('createPluginTranscode', preset, container, this.state.handBrakeMode, this.state.FFmpegMode, function (error, result) { })

    alert('Local plugin created! It can be viewed on the Local plugins tab')

  }



  render() {



    return (





      <div >

        <br />
        <br />
        <br />

        <center><p>Transcode</p> </center>

        <br />
        <br />
        <br />

        <center>  <p>HandBrake<Checkbox checked={this.state.handBrakeMode} onChange={event => {

          this.setState({
            handBrakeMode: !this.state.handBrakeMode,
          })

          if (this.state.FFmpegMode == true) {

            this.setState({
              FFmpegMode: false,
            })

          }


        }} />FFmpeg<Checkbox checked={this.state.FFmpegMode} onChange={event => {

          this.setState({
            FFmpegMode: !this.state.FFmpegMode,
          })

          if (this.state.handBrakeMode == true) {

            this.setState({
              handBrakeMode: false,
            })

          }


        }} /></p></center>

        <br />
        <br />
        <br />

        <p>When using FFmpeg, you need to separate the input and output parameters with a comma. FFmpeg Examples:</p>

<p>-r 1,-r 24</p>
<p>,-sn -c:v copy -c:a copy</p>
<p>,-c:v lib265 -crf 23 -ac 6 -c:a aac -preset veryfast</p>
<p>,-map 0 -c copy -c:v libx265 -c:a aac</p>
<p>-c:v h264_cuvid,-c:v hevc_nvenc -preset slow -c:a copy</p>

<p>Please see the following tools for help with creating FFmpeg commands:</p>

<p><a href="" onClick={(e) => { e.preventDefault(); window.open("http://rodrigopolo.com/ffmpeg/", "_blank"); }}>http://rodrigopolo.com/ffmpeg/</a></p>
<p><a href="" onClick={(e) => { e.preventDefault(); window.open("http://www.mackinger.at/ffmpeg/", "_blank"); }}>http://www.mackinger.at/ffmpeg/</a></p>
<p><a href="" onClick={(e) => { e.preventDefault(); window.open("https://axiomui.github.io/", "_blank"); }}>Axiom</a></p>


<br/>
<br/>
<br/>


<p>HandBrake examples:</p>

<p>-e x264 -q 20 -B</p>
<p>-Z "Very Fast 1080p30"</p>
<p>-Z "Fast 1080p30" -e nvenc_h265 </p>
<p>-Z "Very Fast 1080p30" --all-subtitles --all-audio</p>       
<p>-Z "Very Fast 480p30"</p>
<p>--preset-import-file "C:\Users\HaveAGitGat\Desktop\testpreset.json" -Z "My Preset"</p>

<p>You can learn more about HandBrake presets here:</p>

<p><a href="" onClick={(e) => {e.preventDefault();  window.open("https://handbrake.fr/docs/en/latest/technical/official-presets.html", "_blank") }}>HandBrake presets</a></p>

<br/>
<br/>
<br/>



   


        <p>CLI arguments/preset (avoid using ' ):</p>
        <br />

        <input type="text" className="folderPaths" ref="preset" defaultValue={'-Z "Very Fast 1080p30"'}></input>


        <br />
        <br />
        <br />
        <br />


        <p>Output container:</p>
        <br />


        <input type="text" className="folderPaths" ref="container" defaultValue={"mkv"}></input>

        <br />
        <br />
        <br />
        <br />


        <center>

          <Button variant="outline-light" onClick={this.createPlugin}  >Create Plugin</Button>

        </center>

        <br />
        <br />
        <br />





      </div>

    );
  }
}

export default withTracker(() => {




  return {



  };
})(App);


