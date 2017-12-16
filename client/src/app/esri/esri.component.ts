import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {HelperService} from '../services/helper.service';
import {EsriLoaderService} from 'angular-esri-loader';
import {DonationService} from '../services/donation.service';
import * as _ from 'lodash';
import {SocketService} from '../services/socket.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'my-esri-map',
  templateUrl: './esri.component.html',
  styleUrls: ['./esri.component.css']
})
export class EsriComponent implements OnInit {
  searchWidget: any;
  private Graphic: any;
  private PopupTemplate: any;
  private Point: any;
  private watchUtils: any;
  private webMercatorUtils: any;

  // ElementRef is an element on which map works
  @ViewChild('viewDiv') mapEl: ElementRef;

  private map: any;
  private gl: any;
  private mapView: any;
  private renderer: any;
  private defaultSymbol: any;
  private popupTemplate: any;

  /**
   * Constructor
   * @param helperService
   * @param esriLoader
   */
  constructor(private helperService: HelperService,
              private esriLoader: EsriLoaderService,
              private donorService: DonationService,
              private  socketService: SocketService,
              private activeRoute: ActivatedRoute) {
  }

  /**
   * Pseudo Constructor
   */
  ngOnInit() {
    this.initSocketWatcher();
    // intializing esri
    this.initEsri();
    this.initParams();
  }

  initParams() {
    this.activeRoute
      .queryParams
      .subscribe(params => {
        if (params.linkId) {
          this.helperService.openPopUp(params.linkId);
        }
      });
  }

  initSocketWatcher() {
    this.socketService
      .getNewDonations()
      .subscribe(data => this.addDonationToList(data));
    this.socketService
      .removedDonations()
      .subscribe(data => this.removeDonationFromList(data));
  }

  /**
   * Initializing Map with all it's types and Globals
   * @returns {any}
   */
  initEsri() {
    //Initialize esri
    return this.esriLoader.load({
      // use a specific version of the API instead of the latest
      url: 'https://js.arcgis.com/4.5/'
    }).then(() => {
      // load the map class needed to create a new map
      this.esriLoader.loadModules([
        'esri/Map',
        'esri/views/MapView',
        'esri/Graphic',
        'esri/layers/GraphicsLayer',
        'esri/widgets/Popup',
        'esri/core/watchUtils',
        'esri/geometry/support/webMercatorUtils',
        'esri/widgets/Search',
        'esri/geometry/Point',
        'dojo/domReady!'
      ])
        .then(([
          Map,
          MapView,
          Graphic,
          GraphicsLayer,
          PopupTemplate,
          watchUtils,
          webMercatorUtils,
          Search,
          Point
        ]) => {
          this.watchUtils = watchUtils;
          this.Graphic = Graphic;
          this.PopupTemplate = PopupTemplate;
          this.webMercatorUtils = webMercatorUtils;
          this.Point = Point;
          this.defaultSymbol = {
            type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
            color: 'red',
            outline: { // autocasts as new SimpleLineSymbol()
              color: 'white',
              width: 0.5
            }
          };

          this.renderer = {
            type: 'simple', // autocasts as new SimpleRenderer()
            symbol: this.defaultSymbol,
          };

          this.gl = new GraphicsLayer({id: 'circles'});
          this.map = new Map({
            basemap: 'satellite',
            layers: [this.gl]
          });

          this.mapView = new MapView({
            container: this.mapEl.nativeElement,
            map: this.map,
            center: [-85.050200, 33.125524],
            zoom: 6
          });

          const showEmailAction = {
            title: 'Show email',
            id: 'show-email',
            className: 'esri-icon-contact',
          };
          this.mapView.popup.actions = [];
          this.mapView.popup.actions.push(showEmailAction);


          /**
           * Generation popup template object for map
           */
          this.popupTemplate = new this.PopupTemplate({
            title: 'Donor Info',
            content: `First Name: {firstName}
                <br>
                Last Name: {lastName}
                <br>
                Contact Number: {contactNumber}
                <br>
                Geo: {geo}
                <br>
                Blood Group: {bloodGroup}
                <br>
                Antigen: {antigen}
                <br>
                Email: <span id="email">*****</span>`
          });
          /**
           * Implementing Search
           */

          this.searchWidget = new Search({
            view: this.mapView
          });

          // // Add the search widget to the very top left corner of the view
          this.mapView.ui.add(this.searchWidget, {
            position: 'top-left',
            index: 0
          });
          // Initializing event listeners
          this.events();
        });
    });
  }

  /**
   * Event handling happens here
   */
  events() {
    this.mapView.on('click', event => this.mapClicked(event));
    this.mapView.popup.on('trigger-action', event => this.popupTrigger(event));
    this.gl.then(() => this.helperService.locationObservable().subscribe(location => this.mapCenterWatcher(location)));
    this.watchUtils.whenTrue(this.mapView, 'stationary', event => this.watchMapDragResize(event));

  }

  mapCenterWatcher({coords}: any) {
    //Getting location and passing to map
    this.mapView
      .goTo({
        target: this.Point(coords.longitude, coords.latitude),
        zoom: 10
      });
  }

  /**
   * Event watcher for map drag, resize or zoom change
   * Getting Points
   * @param event
   */
  watchMapDragResize(event) {

    if (!this.mapView.extent) {
      return;
    }
    const extent = this.mapView.extent;
    // Getting points to feel in the map
    this.donorService
      .query('', {max: this.toLatLng(extent.xmax, extent.ymax), min: this.toLatLng(extent.xmin, extent.ymin)})
      .subscribe(data => _.each(data, d => this.addDonationToList(d))); // Complementing response
  }

  /**
   * Popup watcher to edit email
   * @param event
   */
  popupTrigger(event) {
    if (event.action.id === 'show-email') {
      document.getElementById('email').innerHTML = event.target.selectedFeature.attributes.email;
    }
  }

  /**
   * Map watcher to create new donor
   * @param event
   */
  mapClicked(event) {
    if (!this.needToCreateNewDonation(event)) {
      return
    }
    this.helperService.coordinates = {
      latitude: event.mapPoint.latitude,
      longitude: event.mapPoint.longitude
    };

    this.helperService.openPopUp();
  }

  /**
   * Adding donor to map
   * @param donor
   * @returns Number
   */
  addDonationToList(donor) {
    const donorIndex = this.findDonorIndex(donor);
    if (donorIndex > -1) {
      this.removeDonationFromList(donor, donorIndex);
    }
    this.generateGraphicAndAddToLayer({latitude: donor.geo[0], longitude: donor.geo[1]}, donor);
  }


  /**
   * Adding point to a map
   * @param point
   * @param obj
   * @returns {any}
   */
  generateGraphicAndAddToLayer(point, obj) {
    const graphic = new this.Graphic(new this.Point(point.longitude, point.latitude), this.defaultSymbol, obj);
    graphic.popupTemplate = this.popupTemplate;
    this.gl.add(graphic);
    return graphic;
  }

  /**
   * Converter
   * @param x
   * @param y
   * @returns {number[]}
   */
  toLatLng(x, y) {
    return _.reverse(this.webMercatorUtils.xyToLngLat(x, y));
  }

  /**
   * Check whether we need to create ne donor
   * @param event
   * @returns {boolean}
   */
  needToCreateNewDonation(event): boolean {
    let createNewPoint = true;
    this.mapView
      .hitTest(event)
      //This is happening syncronusly
      .then(function (response) {
        // do something with the result graphic
        const graphic = response.results[0].graphic;
        if (graphic) {
          createNewPoint = false;
        }
      });
    // Don't create new dot if user is just clicking on the dot
    return createNewPoint;
  }

  removeDonationFromList(donor, donorIndex = this.findDonorIndex(donor)) {
    do {
      this.gl.remove(this.gl.graphics.items[donorIndex]);
      donorIndex = this.findDonorIndex(donor);
    } while (donorIndex !== -1)
  }

  findDonorIndex(donor) {
    return _.findIndex(this.gl.graphics.items, (d: any) => d.attributes._id === donor._id);
  }
}
