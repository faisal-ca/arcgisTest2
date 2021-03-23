import { subclass, declared, property } from "esri/core/accessorSupport/decorators";
import Widget = require("esri/widgets/Widget");
import watchUtils = require("esri/core/watchUtils");
import popup=require("esri/widgets/Popup");
import { renderable, tsx } from "esri/widgets/support/widget";

import Point = require("esri/geometry/Point");
import MapView = require("esri/views/MapView");

type Coordinates = Point | number[] | any;

interface Center {
  x: number;
  y: number;
}

interface State extends Center {
  interacting: boolean;
  scale: number;
}

interface Style {
  textShadow: string;
}

const CSS = {
  base: "recenter-tool"
};

@subclass("esri.widgets.Recenter")
class Recenter extends declared(Widget) {
  static ctv:boolean=true;
  static cuView:MapView;
  constructor() {
    super();
    this._onViewChange = this._onViewChange.bind(this)
  }

  postInitialize() {
      Recenter.cuView=this.view;
    watchUtils.init(this, "view.center, view.interacting, view.scale", () => this._onViewChange());
    
    
    
  }

  //--------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------

  //----------------------------------
  //  view
  //----------------------------------

  @property()
  @renderable()
  view: MapView;

  //----------------------------------
  //  listener
  //----------------------------------

  @property()
  @renderable()
  listner: any;

  //----------------------------------
  //  active
  //----------------------------------

  @property()
  @renderable()
  active: boolean;

  //----------------------------------
  //  initialCenter
  //----------------------------------

  @property()
  @renderable()
  initialCenter: Coordinates;

  //----------------------------------
  //  state
  //----------------------------------

  @property()
  @renderable()
  state: State;

  //-------------------------------------------------------------------
  //
  //  Public methods
  //
  //-------------------------------------------------------------------

  render() {
    const { x, y, scale } = this.state;
    const styles: Style = {
      textShadow: this.state.interacting ? '-1px 0 red, 0 1px red, 1px 0 red, 0 -1px red' : ''
    };
    
    return (
      <div style="width:30px;height:30px;background:white !important">
        <img src="idcard.png" style="width:30px;height:30px" onclick={this.onClick}/>
      </div>
    );
  }

  private onClick(){
      if(Recenter.ctv){
        Recenter.ctv=false;
        this.listner=Recenter.cuView.on("click",(evt)=>{
            evt.stopPropagation();
            Recenter.cuView.popup.open({
                location: evt.mapPoint.clone(),
                content :"No address was found for this location"
              });
            }); 
      }
      else{
        Recenter.ctv=true;
        if(this.listner){
            this.listner.remove();
        }
      }
  }

  //-------------------------------------------------------------------
  //
  //  Private methods
  //
  //-------------------------------------------------------------------

  private _onViewChange() {
    let { interacting, center, scale } = this.view;
    this.state = {
      x: center.x,
      y: center.y,
      interacting,
      scale
    };
    
  }

  private _defaultCenter() {
    this.view.goTo(this.initialCenter);
  }
}

export = Recenter;