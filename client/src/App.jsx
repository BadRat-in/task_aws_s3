import './App.css';
import axios from 'axios';
import FileCard from './Components/FileCard';
import { useState } from 'react';
import { useEffect } from 'react';
import $ from 'jquery';
function App() {

  let [fileList, setFileList] = useState([]);
  let [newItem, setNewItem] = useState(false);
  let [progress, setProgress] = useState(0);
  let uploadItem = (item) => {
    let imageData = new FormData();
    imageData.append('file', item.target.files[0], item.target.files[0].name);
    $('#loader').css('width', 20 + '%');
    axios.post('http://localhot:5000/upload', imageData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        "enctype": "multipart/form-data"
      },
      onUploadProgress: progressEvent => {
        setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        $('#loader').css('width', progress + '%');
      }
    }).then(res => {
      setNewItem(res.data);
      item.push(res.data);
      setNewItem(true);
      setProgress(0);
    }
    ).catch(err => {
      console.log(err);
    });
  }

  let Items = fileList.map((item, index) => {
    return <FileCard name={item.Key} key={index} size={item.Size} id={index} />
  });

  useEffect(() => {
    axios.get('http://localhost:5000')
      .then(res => {
        setFileList(res.data);
      });
    setInterval(() => {
      if (newItem) {
        axios.get('http://localhost:5000')
          .then(res => {
            setFileList([...fileList, ...res.data]);
          });
        setNewItem(false);
      }
    }, 1000);
  });


  let selectFile = () => {
    let file = document.getElementById("file");
    file.click();
  }



  return (
    <div className="App">
      <div className="loader" id='loader'></div>
      <button onClick={selectFile} className='upload-btn'>Upload File</button>
      <input type="file" id="file" onChange={uploadItem} />
      <div className="container">
        {Items}
      </div>
    </div>
  );
}

export default App;
