import React, { PureComponent } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {storage, firestore} from '../fire';

const uuidv1 = require('uuid/v1');

class ImageUploader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }
  
  initialState = {
    src: null,
    crop: {
      unit: "%",
      width: 100,
      aspect: 1
    },
    blob: null,
  };

  saveImage = () => {
    const {blob} = this.state;
    const storageRef = storage.ref();
    const imageRef = storageRef.child(blob.name);

    imageRef.put(blob).then(async (snapshot) => {
      console.log(snapshot);
      console.log('Uploaded a blob or file!');

      const imageURL = await snapshot.ref.getDownloadURL();

      firestore
        .collection("faces")
        .add({
          imageURL,
        })
        .catch(function(error) {
          console.error(error);
          alert("Error adding payment");
        })
        .then(ref => {
          this.setState(this.initialState);
        });
    });
  }

  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        this.setState({ src: reader.result })
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // If you setState the crop in here you should return false.
  onImageLoaded = image => {
    this.imageRef = image;
  };

  onCropComplete = crop => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        `${uuidv1()}.jpg`
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        this.setState({blob});
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, "image/jpeg");
    });
  }

  render() {
    const { crop, src } = this.state;

    return (
      <div>
        <div>
          <input type="file" onChange={this.onSelectFile} />
        </div>
        {src && (
          <ReactCrop
            src={src}
            crop={crop}
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
          />
        )}
        {/* {croppedImageUrl && (
          <img alt="Crop" style={{ maxWidth: "100%" }} src={croppedImageUrl} />
        )} */}
        <button onClick={this.saveImage}>Save</button>
      </div>
    );
  }
}

export default ImageUploader;