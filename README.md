# Geo Map

Geo Map is a preset for the Moodle activity database.

Leaflet, a JS library for interactive maps. https://leafletjs.com
(c) 2010-2022 Vladimir Agafonkin, (c) 2010-2011 CloudMade

## Description

Users can add markers on an OpenStreetMap.

## Getting started

In the list view template, you can specify the zoom level and map orientation using the coordinate:
<br>
<code>
    // Kartenebenen: 1 = OpenStreetMap, 2 = Topographische Karte, 3 = Luftbild, 4 = ÖPNV, 5 = Stumme Karte (Map layer)
     let maplayer = 1; 
    // Zoomstufe der Karte (Zoom level)
     let zoom = 2.4; 
    // Koordinate zum Ausrichten der Karte (Coordinate)
     let center = [0, 0];
     </code>
<br>
Don't forget to switch off the editor first!

## Language Support

The preset is available in German, but there is not so much to translate. The template can easily be adapted. 

## Screenshots

<img width="400" alt="single view" src="/screenshots/listenansicht.png">
<img width="400" alt="single view" src="/screenshots/einzelansicht.png">
