var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/core/watchUtils", "esri/widgets/support/widget"], function (require, exports, decorators_1, Widget, watchUtils, widget_1) {
    "use strict";
    var CSS = {
        base: "recenter-tool"
    };
    var Recenter = /** @class */ (function (_super) {
        __extends(Recenter, _super);
        function Recenter() {
            var _this = _super.call(this) || this;
            _this._onViewChange = _this._onViewChange.bind(_this);
            return _this;
        }
        Recenter_1 = Recenter;
        Recenter.prototype.postInitialize = function () {
            var _this = this;
            Recenter_1.cuView = this.view;
            watchUtils.init(this, "view.center, view.interacting, view.scale", function () { return _this._onViewChange(); });
        };
        //-------------------------------------------------------------------
        //
        //  Public methods
        //
        //-------------------------------------------------------------------
        Recenter.prototype.render = function () {
            var _a = this.state, x = _a.x, y = _a.y, scale = _a.scale;
            var styles = {
                textShadow: this.state.interacting ? '-1px 0 red, 0 1px red, 1px 0 red, 0 -1px red' : ''
            };
            return (widget_1.tsx("div", { style: "width:30px;height:30px;background:white !important" },
                widget_1.tsx("img", { src: "idcard.png", style: "width:30px;height:30px", onclick: this.onClick })));
        };
        Recenter.prototype.onClick = function () {
            if (Recenter_1.ctv) {
                Recenter_1.ctv = false;
                this.listner = Recenter_1.cuView.on("click", function (evt) {
                    evt.stopPropagation();
                    Recenter_1.cuView.popup.open({
                        location: evt.mapPoint.clone(),
                        content: "No address was found for this location"
                    });
                });
            }
            else {
                Recenter_1.ctv = true;
                if (this.listner) {
                    this.listner.remove();
                }
            }
        };
        //-------------------------------------------------------------------
        //
        //  Private methods
        //
        //-------------------------------------------------------------------
        Recenter.prototype._onViewChange = function () {
            var _a = this.view, interacting = _a.interacting, center = _a.center, scale = _a.scale;
            this.state = {
                x: center.x,
                y: center.y,
                interacting: interacting,
                scale: scale
            };
        };
        Recenter.prototype._defaultCenter = function () {
            this.view.goTo(this.initialCenter);
        };
        var Recenter_1;
        Recenter.ctv = true;
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], Recenter.prototype, "view", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], Recenter.prototype, "listner", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], Recenter.prototype, "active", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], Recenter.prototype, "initialCenter", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], Recenter.prototype, "state", void 0);
        Recenter = Recenter_1 = __decorate([
            decorators_1.subclass("esri.widgets.Recenter")
        ], Recenter);
        return Recenter;
    }(decorators_1.declared(Widget)));
    return Recenter;
});
//# sourceMappingURL=Recenter.js.map