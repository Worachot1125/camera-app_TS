## Camera_TS

1. create project
   - `npx create-expo-app@latest camera-app --template blank-typescript`
2. install packages
   - `npx expo install expo-camera expo-media-library`
   - `npm install --save-dev @types/react @types/react-native`
3. run project
   - `npx expo start`
4. function ต่างๆ
   - ปุ่มถ่ายรูป แสดงภาพของกล้องปัจจุบัน
   - ปุ่มถ่ายรูปใหม่ เมื่อได้ภาพที่ถ่ายให้แสดงรูปที่ถ่าย
   - ปุ่มบันทึก เมื่อกดแล้วให้บันทึกรูปลงอัลบั้มในเครื่อง
   - ปุ่มสลับกล้อง ให้กดแล้วทำการเปลี่ยนกล้องหน้าเป็นกล้องหลัง สลับกัน
   - ปุ่มเปิดไฟแฟลช กดเพื่อเปิดไฟหลังกล้องถ่ายรูป
