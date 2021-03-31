import { Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  NgZone, AfterViewInit, Query} from '@angular/core';
import { setDefaultOptions } from 'esri-loader';
import {loadModules} from 'esri-loader';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import esri=__esri;
import { initialize } from 'esri/identity/IdentityManager';
import { observable } from 'rxjs';
import { AuthService } from '../services/authService';
import { HomeAuthService } from '../services/homeAuth';

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {
  

  private view: any = null;
  private fMap:any=null;
  private fLayerID:any=null;
  private featureLayer:any=null;
  private editFeature:any=null;
  private indiaBoundary:any=null;
  private expand:any=null;
  private firstFlag:boolean=true;
  private mainFeatureLayer:any=null;
  private new_ext:any=null;;
  outsideBoundFlag:Boolean=false;
  user_id:any=-1;

  displayedColumns: string[] = ['name','zoom','Edit','Delete'];
  dataSource:any = [];
  userForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(10)])
}); 
bookmarkForm = new FormGroup({
  bookmarkname: new FormControl('', [Validators.required, Validators.maxLength(10)])
}); 
  @ViewChild('mapViewNode', { static: true }) private mapViewEl!: ElementRef; // needed to inject the MapView into the DOM
  title = 'ng-cli';
  @ViewChild('expandView', { static: true }) private xView!: ElementRef;
  @ViewChild('expandViewbookmark', { static: true }) private bmView!: ElementRef;
  editArea :any=null
  updateInstructionDiv :any =null;
  attributeEditing :any=null;
  inputDescription:string="hello";
  inputUserInfo:any="";
  invalidUserIdFlag: boolean=false;
  showBmTable:boolean=false;
  toggle:boolean=false;
  constructor(private httpS:AuthService,private homeAuthService:HomeAuthService,private authService:AuthService) {}

  ngAfterViewInit(){
    //this.mapService.panToWonder([77.036390, 0.047049]);
    console.log("AfterInit");
  }
  

  public ngOnInit() {
    try{
  
    this.initializeMap().then(() => {
      // The map has been initialized
      
      this.view.constraints = {
        minZoom: 3
        };
      this.view.on("click", (evt:any)=> {
        this.mapViewClick(evt);
        });

      this.httpS.userInfo().subscribe((data:any)=>{
        if(data.body.data.id){
          this.user_id=data.body.data.id;
          this.hideElements();
        }
        
        this.homeAuthService.setView(this.view);
      });

      this.printCount();
      console.log("mapView ready: ", this.view.ready);
    });
    // use esri-loader to load JSAPI modules
  }
  catch(error){
    console.error("EsriLoader: ", error)
  }

      
  }
  async printCount() {
    const [Query]=await loadModules(["esri/tasks/support/Query"]);

      this.view.whenLayerView(this.featureLayer).then(function(lyrView:any){
        var q=new Query();
        q.where='userid = 1';

        return lyrView.queryFeatureCount(q)
      }).then(function(count:any){
        console.log(count);  // prints the total number of client-side graphics to the console
      });
  }

  
  async initializeMap() {
    const options = { url: "./assets/widget/app/Recenter" };
      try {
        //setDefaultOptions({ url: `./assets/widget` });
        // Load the modules for the ArcGIS API for JavaScript
        const [Map, MapView, SceneView, Expand, Layer, FeatureLayer, Home, Popup] = await loadModules([
          "esri/Map",
          "esri/views/MapView",
          "esri/views/SceneView",
          "esri/widgets/Expand",
          "esri/layers/Layer",
          "esri/layers/FeatureLayer",
          "esri/widgets/Home",
          "esri/widgets/Popup",
          
          
          

        ]);

        const container = this.mapViewEl.nativeElement;
        const cont2=this.xView.nativeElement;
        const cont3 =this.bmView.nativeElement;

        this.editArea = document.getElementById("editArea");
        this.updateInstructionDiv = document.getElementById("updateInstructionDiv");
        this.attributeEditing = document.getElementById("featureUpdateDiv");
        document.getElementById('boundErrorArea')!.style.display="none";
        this.invalidUserIdFlag=false;
        // Configure the Map

        var boundary = new FeatureLayer({
          url:"https://gis.nestit.net:3443/server/rest/services/TrainingPOC/POCNewService/FeatureServer/1",
          outFields: ["*"],
        });
        //this.featureLayer=point;
        var query = boundary.createQuery();
    
        boundary.queryFeatures(query).then((results:any) =>{
          if (results.features.length > 0) {
            this.indiaBoundary = results.features[0];
          }
        });
        
        Layer.fromArcGISServerUrl({
          //url:"https://gis.nestit.net:3443/server/rest/services/Training/pgisTest1/MapServer/0"
          url:"https://gis.nestit.net:3443/server/rest/services/TrainingPOC/POCNewService/FeatureServer/0",
          outFields: ["*"],
        }).then((lyr:any)=> {
          //this.mainFeatureLayer = lyr;
          this.featureLayer=lyr;
          this.featureLayer.outFields=["*"];
          this.fMap.add(lyr);
        }).catch((error:any)=>console.log(error));
        // this.featureLayer= new FeatureLayer({
        //   url:"https://gis.nestit.net:3443/server/rest/services/TrainingPOC/POCNewService/FeatureServer/0",
        //   outFields: ["*"],
        // });
        
        const mapProperties = {
          basemap: "gray",
          //layers: [point]
        };

        
  
        this.fMap = new Map(mapProperties);
        //this.featureLayer=new FeatureLayer();
        //this.fMap.add(this.featureLayer);
        // Initialize the MapView
        const mapViewProperties= {
          container: this.mapViewEl.nativeElement,
          center: [ 75.611261,18.360603],
          zoom: 4,
          map: this.fMap
        };
  
        const view = new MapView(mapViewProperties);
        
        var expandbm = new Expand({
          view,
          content: cont3,
          expanded: true,
        });
        view.ui.add(expandbm, "top-left");

        this.expand = new Expand({
          view,
          content: cont2,
          expanded: true,
        });
    
        // Add the widget to the top-right corner of the view
        view.ui.add(this.expand, 'top-right');

        var homeBtn = new Home({
          view
        });
  
        // Add the home button to the top left corner of the view
        view.ui.add(homeBtn, "top-left");

        

        this.view=view;
        await this.view.when();
        
        // var recenter = new Recenter({
        //   view: view,
        //   initialCenter: [-100.33, 43.69]
        // });
        // view.ui.add(recenter, "top-left");
        return this.view;
      } catch (error) {
        console.error("EsriLoader: ", error);
        return null;
      }
  }

  bookmarkform(){
    document.getElementById('bookmarkUpdateDiv')!.style.display="block";
  }

  close(){
    this.bookmarkForm.setValue({bookmarkname:"" });
    
      document.getElementById('bookmarkUpdateDiv')!.style.display="none";
    }

  bmtableClick(){ 
    var bmid= {"id":this.user_id}
    this.authService.BookMarkList(bmid).subscribe(async (data:any)=>{
    if(!this.toggle)
      {
        this.toggle=true;
        //await this.authService.reloadDatasource();
          this.dataSource=data.body;
      }
      else{
        this.toggle=false;
      }
      });  
  }

  createBookmark(data:any)
  {

  }

  zoomBookmark(data:any)
  {

  }
  editBookmark(data:any)
  {

  }

  deleteBookmark(data:any)
  {
    var bm= data.Id;
    this.authService.DeleteBookmark(bm).subscribe((data:any)=>{
      debugger;
      if(data.body.logged)
      {
        alert(data.body.Message)
      }
      debugger;
    })
  }


  hideElements(){
    var query = this.featureLayer.createQuery();
    query.where = this.featureLayer.fields[2].name + " <> " + String(this.user_id);
    
    this.featureLayer.queryFeatures(query).then((results:any) =>{
      if (results.features.length > 0) {
        var v = results.features[0];
        results.features.forEach((element:any )=> {
          //this.view.graphics.remove(element);
          element.visible=false;
        });
        
          var edits = {
            updateFeatures: results.features
          };
          this.applyEdits(edits);
        
      }
    });
  }

  
  mapViewClick(evt:any){
    
    this.unselectFeature();
    // evt.stopPropagation();
    // this.view.popup.open({
    //   location: evt.mapPoint.clone(),
    //   content :"No address was found for this location"
    // });
    document.getElementById('boundErrorArea')!.style.display="none";
    this.view.hitTest(evt).then(async (response:any)=> {
      if (response.results.length > 0 && response.results[0].graphic) {

        var feature = response.results[0].graphic;
        
        await this.selectFeature(feature.attributes[this.featureLayer.objectIdField]);
        

        //this.userForm.setValue({name: String(feature.graphic.attributes.name)});

        this.userForm.setValue({name: String(feature.attributes[
            "name"])});
        this.attributeEditing!.style.display = "block";
        this.updateInstructionDiv!.style.display = "none";
        this.expand.expanded=true;
        
        //this.inputDescription = String(feature.attributes[
        //  "objectid"]);

          
      }
    });
  }

  async selectFeature(objectId:any) {
    // symbol for the selected feature on the view

    const [SimpleMarkerSymbol]=await loadModules(["esri/symbols/SimpleMarkerSymbol"]);
    var selectionSymbol = new SimpleMarkerSymbol({
      color: [0, 0, 0, 0],
      style: "square",
      size: "40px",
      outline: {
        color: [0, 255, 255, 1],
        width: "3px"
      }
    });
    var query = this.featureLayer.createQuery();
    query.where = this.featureLayer.objectIdField + " = " + objectId;

    this.featureLayer.queryFeatures(query).then((results:any) =>{
      if (results.features.length > 0) {
        this.editFeature = results.features[0];
        this.editFeature.symbol = selectionSymbol;
        this.view.graphics.add(this.editFeature);
      }
    });
  }

  unselectFeature() {
    this.attributeEditing.style.display = "none";
    this.updateInstructionDiv.style.display = "block";

    this.invalidUserIdFlag=false;
    this.userForm.setValue({name: ''});
    this.view.graphics.removeAll();
  }

  updateClick() {
    this.invalidUserIdFlag=false;
    if (this.editFeature != null) {
      this.editFeature.attributes["name"] = this.userForm.value.name;
      if(this.editFeature.attributes["userid"] != this.user_id)
      {
        this.invalidUserIdFlag=true;
        return;
      }
      
      var edits = {
        updateFeatures: [this.editFeature]
      };

      this.applyEdits(edits);
    }
  }
  deleteClick(){
    this.invalidUserIdFlag=false;
    if(this.editFeature.attributes["userid"] != this.user_id)
    {
      this.invalidUserIdFlag=true;
      return;
    }
    var edits = {
      deleteFeatures: [this.editFeature]
    };
    this.applyEdits(edits);
  }
  async addClick() {
    
    this.unselectFeature();
    const [Graphic,Point,geometryEngine]=await loadModules([
      "esri/Graphic",
      "esri/geometry/Point",
      "esri/geometry/geometryEngine"
    ]);
    var listener=this.view.on("click",(event:any)=> {
      event.stopPropagation();

      if (event.mapPoint) {
        var point = event.mapPoint.clone();
        point.z = undefined;
        point.hasZ = false;

        var newPoint=new Point({
          latitude:event.mapPoint.latitude,
          longitude:event.mapPoint.longitude
        });
        if(geometryEngine.intersects(this.indiaBoundary.geometry,newPoint))
        {
          this.outsideBoundFlag=false;
          document.getElementById('boundErrorArea')!.style.display="none";
          var newIncident = new Graphic({
            geometry: point,
            attributes: {
              userid: this.user_id
            }
          });

          var edits = {
            addFeatures: [newIncident]
          };
          //this.addPoint(event.mapPoint.longitude,event.mapPoint.latitude);
          this.applyEdits(edits);

          // ui changes in response to creating a new feature
          // display feature update and delete portion of the edit area
          document.getElementById('mapArea')!.style.cursor="auto";
          document.getElementById('updateInstructionDiv')!.style.display="none";
          document.getElementById('featureUpdateDiv')!.style.display="block";
          listener.remove();
        }
        else{
          this.outsideBoundFlag=true;
          document.getElementById('boundErrorArea')!.style.display="block";
        }
      }
      
      else {
        console.error("event.mapPoint is not defined");
      }
    });

    // change the view's mouse cursor once user selects
    // a new incident type to create
    document.getElementById('mapArea')!.style.cursor = "crosshair";
    document.getElementById('editArea')!.style.cursor="auto";
    
  }

 applyEdits(params:any) {
    this.unselectFeature();
    var promise = this.featureLayer.applyEdits(params);
    this.editResultsHandler(promise);
  }

  editResultsHandler(promise:any) {
    promise
      .then((editsResult:any) =>{
        var extractObjectId = (result:any) => {
          return result.objectId;
        };

        // get the objectId of the newly added feature
        if (editsResult.addFeatureResults.length > 0) {
          var adds = editsResult.addFeatureResults.map(
            extractObjectId);
          var newIncidentId = adds[0];

          this.selectFeature(newIncidentId);
        }

        this.httpS.reloadDatasource();
      })
      .catch(function(error:any) {
        console.log("===============================================");
        console.error("[ applyEdits ] FAILURE: ", error.code, error.name,
          error.message);
        console.log("error = ", error);
      });
  }
}