				import {  Component } from '@angular/core';
				import * as FileSaver from 'file-saver';
				import * as XLSX from 'xlsx';
				import {UploadService} from '../services//upload.service';


				import { FileUploader ,FileItem,ParsedResponseHeaders,FileLikeObject} from 'ng2-file-upload';

				import { SpotCheck } from '../models/SpotCheckFields';  

				@Component ({  
				   selector: 'my-app',  
				   templateUrl:'./excelUpload.html',
				   providers:[UploadService]

				})  
				export class ExcelUploadComponent  { 
				 
				  public SpotChecklist: SpotCheck[];
				  public project_master:any[];

				  uploader:FileUploader;

				  constructor(private uploadservice: UploadService ){
					this.SpotChecklist=[];
					this.project_master=[];
				   
				  }
				  ngOnInit(): void {
					  this.uploader = new FileUploader({
						  url: 'http://localhost:5000/upload'
						  // headers: [{name:'Accept', value:'application/json'}],
						  // autoUpload: true,
					  });
					  this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
					  this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
					  
					  //retieve projectmaster details
					  this.getProjectMaster("","SELECT PROJECT MASTER");
					 
				  
					}

				  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
					//console.log("onSuccessItem " + status, response, item);  
					this.SpotChecklist = JSON.parse(response); //success server response
					
					var data = this.validateRow(this.SpotChecklist);

					console.log(data);  
				  }

				  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
					  let error = JSON.parse(response); //error server response
				  }
				  validateRow(lst:any[]) : SpotCheck[]
				  {
					var i:number;
					  for(i=0;i<lst.length ;i++)
					  {
						var validation_message:string="";
						var blnErrOccured:boolean=false;
					   
						if(!this.isEmail(lst[i].RESPONSIBLE_PERSON_EMAIL_ID))
						{
						  validation_message=validation_message+ "," +"RESPONSIBLE_PERSON_EMAIL_ID is invalid"
						  blnErrOccured=true;
						}

					   lst[i].VALIDATION_RESULT=validation_message;
					  }
					  return lst;
				  }

				  isDate(date:string) {
					// return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
				  }

				  isEmail(search:string):boolean
				  {
					var  serchfind:boolean;

					 regexp = new RegExp('/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/');
					
					serchfind = regexp.test(search);

					console.log(serchfind)
					return serchfind
				  }
				  
				  getProjectMaster(project_code:string,Flag:string):any
				  {  

					this.uploadservice.getProjectMaster(project_code,Flag).subscribe(
						response=> {
						  this.project_master= response[0];
						  return response;
						  },
						error=> {
							console.log("ERROR: ",error);
							console.log(error.json()); //gives the object object
						},
						() => {
							console.log("Completed");
						}
					);
				  }



				}