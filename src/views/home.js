import { render } from "@testing-library/react";
import React from "react";
import "react-dropzone-uploader/dist/styles.css";
import Dropzone from "react-dropzone-uploader";

const Input = ({ accept, onFiles, files, getFilesFromEvent }) => {
    return (
      <label
        class="text-center"
        style={{ cursor: "pointer", width: "100%", height: "100%" }}
      >
        <p>
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <p class="mt-1 text-sm text-gray-600">
            <span class="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition duration-150 ease-in-out pr-1">
              Upload a file
            </span>
            or drag and drop
          </p>
          <p class="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 20MB</p>
        </p>
        <input
          style={{ display: "none" }}
          type="file"
          accept={accept}
          onChange={async (e) => {
            const target = e.target;
            const chosenFiles = await getFilesFromEvent(e);
            onFiles(chosenFiles);
            //@ts-ignore
            target.value = null;
          }}
        />
      </label>
    );
};
  
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {pQuality:0.1, minDist: 5};
    }

    SingleUpload = (file) => {
        const toast = (innerHTML) => {
          try {
            const el = document.getElementById("toast");
            el.innerHTML = innerHTML;
          } catch {}
        };
    
        const getUploadParams = async () => {
          return {
            url: "http://localhost:5000/uploadFiles",
          };
        };
    
        const handleChangeStatus = ({ meta, remove, xhr }, status) => {
          console.log(status);
          if (status === "done") {
            if (xhr != undefined && xhr.responseText) {
              let parsed = JSON.parse(xhr.response);
              if (parsed.success == 1) {
                toast(
                  `${meta.name} uploaded!`
                );
                remove();
                this.setState({
                  file: parsed.file,
                });
              } else {
                toast(`${meta.name} failed! Check filesize and filetype!`);
                remove();
              }
            } else {
              toast(`${meta.name} failed! Check filesize and filetype!`);
              remove();
            }
          } else if (status === "aborted") {
            toast(`${meta.name}, upload failed...`);
          }
        };
        const handleStart = () => {
          if (file != null) {
            setTimeout(
              () =>
                toast(
                  `Attached file: <img style="object-fit: contain;" src="http://localhost:5000/uploads/${file}" />`
                ),
              100
            );
          }
        };
        return (
          <React.Fragment>
            <div id="toast" class="mt-0 text-sm text-gray-500"></div>
            <Dropzone
              getUploadParams={getUploadParams}
              onChangeStatus={handleChangeStatus}
              maxFiles={1}
              maxSizeBytes={16000000}
              multiple={false}
              canCancel={false}
              inputContent="Drop A File"
              tex
              styles={{
                dropzoneActive: { borderColor: "green" },
              }}
              classNames={{
                dropzone:
                  "mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md",
              }}
              InputComponent={Input}
            />
            {handleStart()}
          </React.Fragment>
        );
    };

    FileDisplay = () => {
        if(this.state.file != null) {
            return (
                <div>
                    <img src={"http://localhost:5000/uploads/"+this.state.file}></img>
                    {this.FileForm()}
                </div>
            )
        }
    }

    handleChange = (e) => {
        this.setState({[e.target.id]: e.target.value}, () => {})
    }

    handleFileFormSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:5000/identifyPoints?img="+this.state.file+"&pQuality="+this.state.pQuality+"&minDist="+this.state.minDist)
        .then((response) => response.json())
        .then((data) => {
            if(data.success) {
                this.setState({file: data.file})
            }
        });
    }

    FileForm = () => {
        return (
            <form onSubmit = {this.handleFileFormSubmit}>
                <label for="pQuality">Point Quality</label>
                <input type="range" min="0" max="1" step="0.1" value={this.state.pQuality} class="slider" id="pQuality" onChange={this.handleChange}></input>
                <label for="minDist">Minimum Distance</label>
                <input type="range" min="0" max="100" value={this.state.minDist} class="slider" id="minDist" onChange={this.handleChange}></input>
                <input type="submit" value="Submit"></input>
            </form> 
        )
    }

    render() {
        return (
            <div>
                <p className="text-yellow-100">Hi</p>
                {this.SingleUpload(null)}
                {this.FileDisplay()}
            </div>
        );
    }
}