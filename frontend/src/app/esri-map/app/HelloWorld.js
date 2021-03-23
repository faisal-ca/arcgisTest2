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
define(["require", "exports", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/widgets/support/widget"], function (require, exports, decorators_1, Widget, widget_1) {
    "use strict";
    var CSS = {
        base: "esri-hello-world",
        emphasis: "esri-hello-world--emphasis"
    };
    var HelloWorld = /** @class */ (function (_super) {
        __extends(HelloWorld, _super);
        function HelloWorld() {
            //--------------------------------------------------------------------------
            //
            //  Properties
            //
            //--------------------------------------------------------------------------
            var _this = _super !== null && _super.apply(this, arguments) || this;
            //----------------------------------
            //  firstName
            //----------------------------------
            _this.firstName = "John";
            //----------------------------------
            //  lastName
            //----------------------------------
            _this.lastName = "Smith";
            //----------------------------------
            //  emphasized
            //----------------------------------
            _this.emphasized = false;
            return _this;
        }
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        HelloWorld.prototype.render = function () {
            var _a;
            var greeting = this._getGreeting();
            var classes = (_a = {},
                _a[CSS.emphasis] = this.emphasized,
                _a);
            return (widget_1.tsx("div", { bind: this, class: CSS.base, classes: classes }, greeting));
        };
        //--------------------------------------------------------------------------
        //
        //  Private Methods
        //
        //--------------------------------------------------------------------------
        HelloWorld.prototype._getGreeting = function () {
            return "Hello, my name is " + this.firstName + " " + this.lastName + "!";
        };
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], HelloWorld.prototype, "firstName", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], HelloWorld.prototype, "lastName", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], HelloWorld.prototype, "emphasized", void 0);
        HelloWorld = __decorate([
            decorators_1.subclass("esri.widgets.HelloWorld")
        ], HelloWorld);
        return HelloWorld;
    }(decorators_1.declared(Widget)));
    return HelloWorld;
});
//# sourceMappingURL=HelloWorld.js.map