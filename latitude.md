สรุปปัญหา:
Ontology มี properties Latitude และ Longitude แต่ไม่มีค่าใน Location instances
RestaurantService.java ไม่ได้ดึง Latitude/Longitude จาก Location resource
Restaurant.java model ไม่มี fields สำหรับ latitude/longitude
Frontend ใช้ hardcoded coordinates
วิธีแก้:
เพิ่ม latitude/longitude ใน ontology (ถ้ายังไม่มี)
เพิ่ม fields ใน Restaurant.java
แก้ RestaurantService.java ให้ดึง latitude/longitude จาก Location resource
อัปเดต frontend ให้ใช้ coordinates จาก backend
กำลังตรวจสอบว่า RestaurantService ดึง Location resource อย่างไร:
สรุปปัญหา
Ontology มี properties Latitude และ Longitude แต่ไม่มีค่าใน Location instances
Restaurant.java model ไม่มี fields สำหรับ latitude/longitude
RestaurantService.java ไม่ได้ดึง Latitude/Longitude จาก Location resource
Frontend ใช้ hardcoded coordinates
วิธีแก้ไข
1. เพิ่ม Latitude/Longitude fields ใน Restaurant Model
Restaurant.java
+15
-1
    @Column(name = "nationality")
    // เพิ่ม fields ใหม่    @Column(name = "latitude")    private Double latitude;    @Column(name = "longitude")
45 hidden lines
2. แก้ไข RestaurantService เพื่อดึง Latitude/Longitude
RestaurantService.java
+32
            return restaurant;
            // เพิ่มโค้ดนี้เพื่อดึง Latitude/Longitude จาก Location resource            if (location != null && !location.equals("N/A") && location.startsWith("http")) {                try {                    Resource locationResource = model.getResource(location);                    if (locationResource != null) {                        // ดึง Latitude
3. เพิ่มข้อมูล Latitude/Longitude ใน Ontology
ถ้ายังไม่มีค่าใน ontology ให้เพิ่มใน Location instances เช่น:
<re:Location rdf:about="http://www.semanticweb.org/acer/ontologies/2567/8/restaurantontologyfinal#SakuntongLocation">  <re:Subdistrict>Talat Yai</re:Subdistrict>  <re:Province>Phuket</re:Province>  <re:PlaceName>Sakuntong Location</re:PlaceName>  <re:District>Mueang Phuket</re:District>  <!-- เพิ่มบรรทัดเหล่านี้ -->  <re:Latitude rdf:datatype="http://www.w3.org/2001/XMLSchema#double">7.8842</re:Latitude>  <re:Longitude rdf:datatype="http://www.w3.org/2001/XMLSchema#double">98.3889</re:Longitude>  <!-- ... existing code ... --></re:Location>
4. แก้ไข Frontend เพื่อใช้ Coordinates จาก Backend
locationUtils.js
+10
  const restaurantName = restaurant.restaurantName || restaurant.name || null;
  // ใช้ coordinates จาก backend ก่อน (ถ้ามี)  if (restaurant.latitude != null && restaurant.longitude != null) {    return {       lat: parseFloat(restaurant.latitude),       lon: parseFloat(restaurant.longitude)     };
ขั้นตอนการทำ
เพิ่ม latitude/longitude ใน ontology สำหรับแต่ละ Location (ใช้ Google Maps หรือแหล่งข้อมูลอื่น)
อัปเดต Restaurant.java model
อัปเดต RestaurantService.java เพื่อดึง coordinates
อัปเดต frontend locationUtils.js เพื่อใช้ coordinates จาก backend
ทดสอบ: รีสตาร์ท backend และ frontend แล้วตรวจสอบว่า map แสดงร้านอาหารถูกต้อง
ต้องการให้ช่วยเพิ่มข้อมูล coordinates ใน ontology หรือมีคำถามเพิ่มเติมไหม?