import React, { useRef, useEffect, useState } from 'react'
import '@tensorflow/tfjs';
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "../styles.css"
import personPng from "../media/person.png";

const PersonDetectionPanel = () => {

  const videoRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);
  const [personCount, setPersonCount] = useState<number>(0);

  const getVideo = async () => {
    await navigator.mediaDevices.getUserMedia({
      // video: {width: 1920, height:1080}
      video: {width: 760, height:520}
      // video: true
    })
    .then(stream => {
      let video = videoRef.current;
        video.srcObject = stream;
        video.play()
    })
    .catch(err => {
      console.error(err);
    })
  }

  useEffect(()=>{
    getVideo();
  }, [videoRef])

  let canvas:HTMLCanvasElement;
  let ctx:any;
  useEffect(()=>{
    canvas = canvasRef.current as HTMLCanvasElement;
    ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#00FFFF"
  },[canvasRef])
  
  function drawBox(results:any) {
		let person = 0;
		for(let i = 0; i <= results?.length; ++i) {
			if(results[i]?.class == "person") {
				person++;
				ctx?.beginPath();
				ctx?.rect(results[i]?.bbox[0], results[i]?.bbox[1],results[i]?.bbox[2], results[i]?.bbox[3]);
				ctx?.stroke();
			}
      setPersonCount(person)
		}
	}

  let modelPromise:any;
  let model;
  let results;
  window.onload = () => modelPromise = cocoSsd.load();

  async function objectDetection() {
		model = await modelPromise;
		results = await model?.detect(canvas);
		drawBox(results);
	}

	async function getVideoFrame(){
		ctx?.save();
		ctx?.clearRect(0, 0, ctx?.canvas.width, ctx?.canvas.height);
		ctx?.drawImage(videoRef.current, 0, 0);
		await objectDetection();
		ctx?.restore();
	}

	setInterval(getVideoFrame, 1);

  const videoStyle = {
    display:'None'
  }

  return (
    <div className="personDetectionContainer">
        <video ref={videoRef} style={videoStyle} autoPlay />
        <div className="platformInfo"><b>Elevation Platform Load</b></div>
        <canvas ref={canvasRef} width="760px" height="520px"></canvas>
        <div className="loadStatus">
            <div className="platformId">ID: LA-EP02</div>
            <div className="personStatus">
                <img className="personPng" src={personPng} />
                <div className="personCount">{personCount}</div>
            </div>
            <div className={personCount==0?"platformStatusEmpty":personCount<=4?"platformStatusSafe":"platformStatusOverweight"}><b>{personCount==0?"Empty":personCount<=4?"Safe":"Overweight"}</b></div>
        </div>
    </div>
  )
}

export default PersonDetectionPanel