-- universities in city of nis
select 
	points.name as university_name, 
	ST_Transform(points.way, 4326) as geometry
from planet_osm_polygon as polygons
join planet_osm_point as points
on ST_Contains(polygons.way, points.way)
where polygons.name = 'Град Ниш' and 
	points.amenity = 'university';

-- restaurants near centre of city of nis
select 
	points.name as restaurant_name, 
	ST_Distance(points.way, polygons_2.way) as distance, 
	ST_Transform(points.way, 4326) as geometry
from planet_osm_polygon as polygons_1
join planet_osm_polygon as polygons_2
on ST_Contains(polygons_1.way, polygons_2.way) and 
	polygons_1.name = 'Град Ниш'
join planet_osm_point as points
on ST_DWithin(points.way, polygons_2.way, 500)
where polygons_2.name = 'Трг краља Милана' and 
	points.amenity = 'restaurant'
order by distance ASC;

-- monuments alongside river nisava
select 
	points.name as monument_name,
	ST_Distance(points.way, lines.way) as distance, 
	ST_Transform(points.way, 4326) as geometry
from planet_osm_line as lines
join planet_osm_point as points
on ST_DWithin(points.way, lines.way, 1000)
where lines.waterway = 'river' and lines.name = 'Нишава' and
	points.historic = 'monument';
	
-- bus lines going through given bus-stop
select 
	lines.ref as route_number,
	lines.name as route_name,
	ST_Length(lines.way) as route_length, 
	ST_Transform(lines.way, 4326) as geometry
from planet_osm_polygon as polygons
join planet_osm_line as lines
on ST_Contains(polygons.way, lines.way) and 
	polygons.name = 'Град Ниш'
join planet_osm_point as points
on ST_DWithin(points.way, lines.way, 10)
where lines.route = 'bus' and 
	points.highway = 'bus_stop' and points.name = 'Трг краља Милана';
	
-- location of crossings on a given street
select
	ST_X(points.way) as lat,
	ST_Y(points.way) as long, 
	ST_Transform(points.way, 4326) as geometry
from planet_osm_roads as roads
join planet_osm_polygon as polygons
on ST_Contains(polygons.way, roads.way) and polygons.name = 'Град Ниш'
join planet_osm_point as points
on ST_Intersects(points.way, roads.way)
where roads.name = 'Вожда Карађорђа' and 
	points.highway = 'crossing';
	
	
	
	
	
	
	
	
-- DROP INDEX public.planet_osm_line_way_idx;
-- DROP INDEX public.planet_osm_point_way_idx;
-- DROP INDEX public.planet_osm_polygon_way_idx;
-- DROP INDEX public.planet_osm_roads_way_idx;
	
	
	
	
	