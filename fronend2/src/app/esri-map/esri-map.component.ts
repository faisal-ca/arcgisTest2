import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  Inject,
  NgZone
} from '@angular/core';
import { DOCUMENT } from '@angular/common'; 
import Map from '@arcgis/core/Map'
import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import Bookmarks from '@arcgis/core/widgets/Bookmarks';
import Expand from '@arcgis/core/widgets/Expand';
import esriConfig from '@arcgis/core/config.js';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point'
import Polyline from '@arcgis/core/geometry/Polyline'
import Layer from '@arcgis/core/layers/Layer'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol'
import PortalItem from '@arcgis/core/portal/PortalItem'
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol'
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';
import { HomeAuthService } from '../services/homeAuth';
import { AuthService } from '../services/authService';
import { stringify } from '@angular/compiler/src/util';
//import dom from 'dojo-dom/dom';

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
  outsideBoundFlag:Boolean=false;
  user_id:any=-1;
  userForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(10)])
}); 
  @ViewChild('mapViewNode', { static: true }) private mapViewEl!: ElementRef; // needed to inject the MapView into the DOM
  title = 'ng-cli';
  @ViewChild('expandView', { static: true }) private xView!: ElementRef;
  editArea :any=null
  updateInstructionDiv :any =null;
  attributeEditing :any=null;
  //inputDescription = document.getElementById("inputDescription");
  //inputUserInfo = document.getElementById("inputUserInfo");
  inputDescription:string="hello";
  inputUserInfo:any="";
  constructor(private zone: NgZone, @Inject(DOCUMENT) docu:any,private httpS:AuthService,
              private homeAuthService:HomeAuthService) { }

  

  initializeMap(): Promise<any> {
    const container = this.mapViewEl.nativeElement;
    const cont2=this.xView.nativeElement;

    this.editArea = document.getElementById("editArea");
    this.updateInstructionDiv = document.getElementById("updateInstructionDiv");
    this.attributeEditing = document.getElementById("featureUpdateDiv");
    
    const sMap = new Map({
      basemap:'streets',
      ground: 'world-elevation'
    });

    const webmap = new WebMap({
      portalItem: {
        id: 'aa1d3f80270146208328cf66d022e09c',
      },
    });

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

    var pitem=new PortalItem();
    pitem.id='511b97fc0d364367b127f8ba5c89ad13';
    
    Layer.fromArcGISServerUrl({
      //url:"https://gis.nestit.net:3443/server/rest/services/Training/pgisTest1/MapServer/0"
      url:"https://gis.nestit.net:3443/server/rest/services/TrainingPOC/POCNewService/FeatureServer/0"
    }).then((lyr:any)=> {
      this.featureLayer = lyr;
      this.fMap.add(lyr);
    }).catch((error:any)=>console.log(error));
    
    /*
    Layer.fromPortalItem({
      portalItem: pitem
    }).then((lyr:any)=> {
      this.featureLayer = lyr;
      this.fMap.add(lyr);
    }).catch((error:any)=>console.log(error));*/
    
    const mapProperties = {
      basemap: "streets",
      //layers: [point]
    };

    this.fMap = new Map(mapProperties);
    const view = new MapView({
      container,
      center: [ 75.611261,18.360603],
      zoom: 4,
      
      map: this.fMap
    });
    
    const bookmarks = new Bookmarks({
      view,
      // allows bookmarks to be added, edited, or deleted
      editingEnabled: true,
    });

    //const editArea = dom.byId("editArea");
    this.expand = new Expand({
      view,
      content: cont2,
      expanded: true,
    });

    // Add the widget to the top-right corner of the view
    view.ui.add(this.expand, 'top-right');

    const graphicsLayer = new GraphicsLayer();
    this.fMap.add(graphicsLayer);
    this.fLayerID=graphicsLayer.id;
    
    
    
    // bonus - how many bookmarks in the webmap?
    webmap.when(() => {
      if (webmap.bookmarks && webmap.bookmarks.length) {
        console.log('Bookmarks: ', webmap.bookmarks.length);
      } else {
        console.log('No bookmarks in this webmap.');
      }
    });

    this.view = view;
    return this.view.when();
  }


  ngOnInit(): any {

    //this.userForm.setValue({name: "faisal"});
    esriConfig.assetsPath = '/assets';
    document.getElementById('boundErrorArea')!.style.display="none";
    this.zone.runOutsideAngular(() => {
      // Initialize MapView and return an instance of MapView
      this.initializeMap().then(() => {
        // The map has been initialized
        this.zone.run(() => {
          this.view.constraints = {
            minZoom: 3
            };
          //this.view.on("click",(event:any)=> {this.eventHandler(event)});
          for (const v of this.fMap.layers) {
            v.visible = true;
          }
          this.inputDescription='hi2';
          this.view.on("click", (evt:any)=> {
            this.mapViewClick(evt);
            });

            this.httpS.userInfo().subscribe((data:any)=>{
              if(data.body.data.id){
                this.user_id=data.body.data.id;
                this.hideElements();
              }
            });
          console.log('mapView ready: ');
        });
      });

    });
    this.homeAuthService.setView(this.view);
    
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
    
    this.view.hitTest(evt).then((response:any)=> {
      if (response.results.length > 0 && response.results[0].graphic) {

        var feature = response.results[0].graphic;
        
        this.selectFeature(feature.attributes[this.featureLayer.objectIdField]);
        

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

  selectFeature(objectId:any) {
    // symbol for the selected feature on the view
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

    this.userForm.setValue({name: ''});
    this.view.graphics.removeAll();
  }
  eventHandler(event:any) {
        
    //this.addPoint(event.mapPoint.longitude,event.mapPoint.latitude);
     //alert(Math.floor(event.mapPoint.latitude*1000+0.5)/1000 +"," + Math.floor(event.mapPoint.longitude*1000+0.5)/1000);
  }
  ngOnDestroy(): void {
    if (this.view) {
      // destroy the map view
      this.view.destroy();
    }
  }

  customPopupFunction(feature:any) {
    
    //  return `<table style="table"><tr><strong>${feature.graphic.attributes.id}</tr><tr><strong>${feature.graphic.attributes.userid}</tr><tr><strong>${feature.graphic.attributes.name}</tr></table>`;
     return `<table  style="table;width: 100%;";border=1;><tr>
     <th>id</th>
       <th>userid</th>
       <th>name</th>
       <th>location</th>
     </tr>
     <tr>
       <td>${feature.graphic.attributes.id}</td>
       <td>${feature.graphic.attributes.userid}</td>
       <td>${feature.graphic.attributes.name}</td>
       <td>${feature.graphic.attributes.location}</td>
   
     </tr></table>`;
  
  }

  addPoint(long?:any,lat?:any){
    var p2=new Point({
      longitude:long,
      latitude: lat
    });
    

    const simpleMarkerSymbol = {
        type: "simple-marker",
        color: [226, 119, 40],  
        outline: {
            color: [255, 255, 255], 
            width: 1
        }
    };

    
    const pointGraphic = new Graphic({
        geometry:p2,
        symbol: simpleMarkerSymbol
        });
        
    this.fMap.findLayerById(this.fLayerID).add(pointGraphic);
  }
  updateClick() {
    if (this.editFeature != null) {
      this.editFeature.attributes["name"] = this.userForm.value.name;
      this.editFeature.visible=false;
      var edits = {
        updateFeatures: [this.editFeature]
      };

      this.applyEdits(edits);
    }
  }
  deleteClick(){
    var edits = {
      deleteFeatures: [this.editFeature]
    };
    this.applyEdits(edits);
  }
  addClick() {
    this.unselectFeature();
    this.inputDescription='hi';
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
              userid:this.user_id
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
    //unselectFeature();
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

          //selectFeature(newIncidentId);
        }
      })
      .catch(function(error:any) {
        console.log("===============================================");
        console.error("[ applyEdits ] FAILURE: ", error.code, error.name,
          error.message);
        console.log("error = ", error);
      });
  }
}
