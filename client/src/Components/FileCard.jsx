import React from 'react';
import "./filecard.css";
import { useState, useEffect } from 'react';
import Doc from '../Assets/Images/doc.jpeg';
import Pdf from '../Assets/Images/pdf.png';
import Video from '../Assets/Images/video.png';
import Audio from '../Assets/Images/audio.png';

function FileCard(params) {
  let [size, setSize] = useState("");
  let [url, setUrl] = useState("");
  let [image, setImage] = useState("");
  let [name, setName] = useState("");

  useEffect(() => {
    if (params.size < 1024) {
      setSize(params.size + " B");
    } else if (params.size < 1048576) {
      setSize((params.size / 1024).toFixed(2) + " KB");
    } else if (params.size < 1073741824) {
      setSize((params.size / 1048576).toFixed(2) + " MB");
    }
    setUrl("https://test-trusted-communities.s3.ap-south-1.amazonaws.com/" + params.name);
    if (params.name.endsWith(".pdf")) {
      setImage(Pdf);
    } else if (params.name.endsWith(".mp4") || params.name.endsWith(".mov") || params.name.endsWith(".avi") || params.name.endsWith(".mkv" || params.name.endsWith(".mpeg"))) {
      setImage(Video);
    } else if (params.name.endsWith(".png") || params.name.endsWith(".jpg") || params.name.endsWith(".jpeg") || params.name.endsWith(".gif") || params.name.endsWith(".ico")) {
      setImage(url);
    } else if (params.name.endsWith(".mp3") || params.name.endsWith(".wav") || params.name.endsWith(".flac") || params.name.endsWith(".aac") || params.name.endsWith(".ogg")) {
      setImage(Audio);
    } else {
      setImage(Doc);
    }

    if (params.name.length > 15) {
      setName(params.name.substring(0, 15) + "...");
    } else {
      setName(params.name);
    }
  }
    , [params.size, params.name, url])

  let showFile = () => {
    window.open(url);
  }

  return (
    <div className="card" onClick={showFile} id={params.id} itemsize={size}>
      <div>
        <img src={image} alt={params.name} />
      </div>
      <span>{name}</span>
      <button className='delete-btn'>Delete</button>
    </div>
  )
}

export default FileCard
