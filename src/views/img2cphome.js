import { render } from "@testing-library/react";
import React from "react";
import "react-dropzone-uploader/dist/styles.css";
import Dropzone from "react-dropzone-uploader";
import { getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";

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
            <span class="font-medium text-lime-500 hover:text-lime-400 focus:outline-none focus:underline transition duration-150 ease-in-out pr-1">
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
        this.state = {pQuality:0.1, minDist: 5, index: 0};
    }

    SingleUpload = (file) => {
        const toast = (innerHTML) => {
          try {
            const el = document.getElementById("toast");
            el.innerHTML = innerHTML;
          } catch {}
        };
    
        const getUploadParams = async () => {
          let token = await getID();
          return {
            url: "https://apiauth.origamihub.xyz/uploadFiles",
            headers: {"idtoken": token}
          };
          
        };

        const getID = async () => {
          return new Promise((resolve, reject) => {
            getAuth()
              .currentUser.getIdToken(false)
              .then((idToken, err) => {
                return resolve(idToken);
              })
              .catch((error) => {
                alert("Activation error. Try signing out and signing in again.");
                reject(error);
              });
          });
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
                  files: parsed.files,
                  index: 0
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
                  `Attached file: <img style="object-fit: contain;" src="https://apiauth.origamihub.xyz/uploads/${file}" />`
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

    ReferencePageButton = () => {
      if (this.state.rref != null && this.state.rref.length > 1) {
        const i = this.state.index
        if (i < 1) {
          return(
            <div className="inline-block px-2">
              <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" className="fill-gray-500 inline-block"><path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm3 5.753l-6.44 5.247 6.44 5.263-.678.737-7.322-6 7.335-6 .665.753z"/></svg>
              <a onClick={() => this.setState({index: i+1})}>
                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" className="fill-lime-500 inline-block hover:fill-lime-400 active:fill-lime-600"><path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm-3 5.753l6.44 5.247-6.44 5.263.678.737 7.322-6-7.335-6-.665.753z"/></svg>
              </a>
            </div>
          )
        }
        if (i >= this.state.rref.length-1) {
          return(
            <div className="inline-block px-2">
              <a onClick={() => this.setState({index: i-1})}>
                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" className="fill-lime-500 inline-block hover:fill-lime-400 active:fill-lime-600"><path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm3 5.753l-6.44 5.247 6.44 5.263-.678.737-7.322-6 7.335-6 .665.753z"/></svg>
              </a>
              <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" className="fill-gray-500 inline-block"><path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm-3 5.753l6.44 5.247-6.44 5.263.678.737 7.322-6-7.335-6-.665.753z"/></svg>
            </div>
          )
        }
        return(
          <div className="inline-block px-2">
            <a onClick={() => this.setState({index: i-1})}>
              <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" className="fill-lime-500 inline-block hover:fill-lime-400 active:fill-lime-600"><path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm3 5.753l-6.44 5.247 6.44 5.263-.678.737-7.322-6 7.335-6 .665.753z"/></svg>
            </a>
            <a onClick={() => this.setState({index: i+1})}>
                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" className="fill-lime-500 inline-block hover:fill-lime-400 active:fill-lime-600"><path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm-3 5.753l6.44 5.247-6.44 5.263.678.737 7.322-6-7.335-6-.665.753z"/></svg>
            </a>
          </div>
        )
      }
    }

    FileDisplay = () => {
        let out = []
        if(this.state.files != null) {
            out.push(
                <div className="p-5">
                    <img src={"https://apiauth.origamihub.xyz/uploads/"+this.state.files[this.state.index]} className="object-scale-down h-38 w-38"></img>
                    {this.FileForm()}
                </div>
            )
        }
        if(this.state.rref != null) {
          console.log(this.state.rref)
          out.push(<div class="col-span-1 p-5"><img src={"https://apiauth.origamihub.xyz/references/"+this.state.lref[this.state.index]}></img></div>)
          out.push(<div class="col-span-1 p-5"><img src={"https://apiauth.origamihub.xyz/references/"+this.state.rref[this.state.index]}></img></div>)
        }
        return <div className="grid grid-cols-3 gap-6">{out}</div>;
    }

    handleChange = (e) => {
        this.setState({[e.target.id]: e.target.value}, () => {})
    }

    handleFileFormSubmit = (e) => {
      e.preventDefault();
      if (!this.state.loading) {
        this.setState({loading: true})
        getAuth()
          .currentUser.getIdToken(false)
          .then((idToken, err) => {
            fetch("https://apiauth.origamihub.xyz/identifyPoints?img="+this.state.files[this.state.index]+"&pQuality="+this.state.pQuality+"&minDist="+this.state.minDist, 
            {
              headers: {idtoken: idToken}
            })
            .then((response) => response.json())
            .then((data) => {
                if(data.success) {
                    this.setState({loading: false, files: data.files, lref: data.lref_files, rref: data.rref_files})
                }
            })
            .catch((error) => {
              alert("An error occurred during reference calculation. Please make sure the uploaded crease pattern is valid. If the error persists, please submit an issue on the Github. ")
            }); 
          });
        }
      else {
        alert("A reference calculation is already running. Please wait until it is done to submit another request. ") 
      }
    }

    Loading  = () => {
      if (this.state.loading) {
        return(
            <div
              class="inline-block p-2 h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status">
              <span
                class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                >Loading...</span
              >
            </div>
        )
      }
    }
    FileForm = () => {
        return (
            <form onSubmit = {this.handleFileFormSubmit} onChange = {this.handleFileFormChange} class="flex flex-col justify-left items-left p-8 col-span-1">
                <label for="pQuality" className="block text-sm font-medium leading-5 text-gray-500">Point Quality ({this.state.pQuality})</label>
                <input type="range" min="0" max="1" step="0.1" value={this.state.pQuality} class="slider p-4 accent-lime-500 active:accent-lime-400 !border-none" id="pQuality" onChange={this.handleChange}></input>
                <label for="minDist" className="block text-sm font-medium leading-5 text-gray-500">Minimum Distance ({this.state.minDist})</label>
                <input type="range" min="0" max="100" value={this.state.minDist} class="slider p-4 accent-lime-500 active:accent-lime-400 outline-0" id="minDist" onChange={this.handleChange}></input>
                <div class="px-4">
                  <input type="submit" value="Calculate Reference" class="inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-zinc-900 bg-lime-500 hover:bg-lime-400 focus:outline-none focus:border-lime-600 focus:shadow-outline-indigo active:bg-lime-600 transition duration-150 ease-in-out">
                  </input>
                  {this.Loading()}
                  {this.ReferencePageButton()}
                </div>
            </form> 
        )
    }

    render() {
        return (
            <div class="">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Reverse Reference Finder for Crease Pattern Images</h3>
                {this.SingleUpload(null)}
                {this.FileDisplay()}
            </div>
        );
    }
}