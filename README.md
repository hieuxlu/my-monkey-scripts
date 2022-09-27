# Tải nhiều hóa đơn điện tử cùng 1 lúc
## Cài Đặt 
- Cài đặt Chrome Extension [TamperMonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)
- Mở trang https://hoadondientu.gdt.gov.vn/tra-cuu/tra-cuu-hoa-don, đăng nhập và vào mục [Tra cứu hóa đơn](https://hoadondientu.gdt.gov.vn/tra-cuu/tra-cuu-hoa-don)
- Mở menu TamperMonkey trên Chrome Extension, chọn "Create New Script" để tạo script mới

![image](https://user-images.githubusercontent.com/11418231/192495999-468749c6-36b7-4b35-90e1-f8492890dddb.png)

- Paste script bên dưới vào
```javascript
// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://hoadondientu.gdt.gov.vn/tra-cuu/tra-cuu-hoa-don
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.vn
// @grant        none
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @require https://gist.githubusercontent.com/BrockA/2625891/raw/9c97aa67ff9c5d56be34a55ad6c18a314e5eb548/waitForKeyElements.js
// @require http://cdn.jsdelivr.net/g/filesaver.js
// @require      https://raw.githubusercontent.com/hieuxlu/my-monkey-scripts/master/hoadondientu.gdt.gov.vn/DownloadAllInvoices.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
```

- Note: Có thể review content của script ở trong file [DownloadAllInvoices.js](./hoadondientu.gdt.gov.vn/DownloadAllInvoices.js)

## Cách sử dụng 
- Sau khi cài đặt thành công, mở trang "Tra cứu hóa đơn điện tử mua vào", sẽ xuất hiện thêm button "Download All"
- Thực hiện "Tìm kiếm" để hiển thị kết quả ở bảng bên dưới (sau đó có thể chọn hiện 15,30,50 hóa đơn/trang)  
- Nhấn Download All để download toàn bộ hóa đơn đang được hiển thị trong trang hiện tại
- Nếu có lỗi khi download hóa đơn nào đó (thường do lỗi của trang web Hóa Đơn Điện Tử), nhấn Retry để download các hóa đơn bị lỗi
- Sau khi download xong ở trang 1, nhấn trang tiếp theo, và nhấn Download All lại để download tiếp các hoá đơn trong trang mới
![image](https://user-images.githubusercontent.com/11418231/192498862-05f27614-ff7f-4959-b6f5-280fe308e673.png)

