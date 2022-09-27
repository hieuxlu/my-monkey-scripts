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
// ==/UserScript==
// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(async function () {
    'use strict';

    // Your code here...
    var EXPORT_URL = 'https://hoadondientu.gdt.gov.vn:30000/query/invoices/export-xml';
    var invoiceTableSelector = '.ant-tabs-content.ant-tabs-top-content > .ant-tabs-tabpane:nth-child(2) > .ant-row .ant-table-wrapper ';

    var jwtCookie = await window.cookieStore.get('jwt');
    if (!jwtCookie.value) {
        throw new Error('Authentication cookie not found');
    }

    waitForKeyElements(invoiceTableSelector, actionFunction, true);
    var isBrowserSupported = window.cookieStore && (typeof Promise !== 'undefined');
    var failures = [];
    var successes = [];
    var currentPageData = [];
    var downloadDiv = document.createElement('div');

    function actionFunction() {
        'use strict';

        // Your code here...
        downloadDiv.classList.add('download-section');

        var downloadButton = document.createElement('button');
        downloadButton.innerText = isBrowserSupported ? "Download All" : "Unsupported Browser";

        var progressText = document.createElement('span');
        progressText.classList.add('download-progress')

        var errorRow = document.createElement('div');
        errorRow.classList.add('download-error-section')

        var errorMessage = document.createElement('span');
        errorMessage.classList.add('download-error')
        errorRow.appendChild(errorMessage);

        var retryLink = document.createElement('a');
        retryLink.classList.add('download-retry-link')
        retryLink.style.display = 'none';
        errorRow.appendChild(retryLink);

        downloadDiv.appendChild(downloadButton);
        downloadDiv.appendChild(progressText);
        downloadDiv.appendChild(errorRow);


        var outInvoiceTable = document.querySelector(invoiceTableSelector);
        outInvoiceTable.parentElement.insertBefore(downloadDiv, outInvoiceTable);

        if (isBrowserSupported) {
            downloadButton.addEventListener('click', handleDownloadAll);
            retryLink.addEventListener('click', handleRetry);
        }
    }

    async function handleDownloadAll() {
        var outInvoiceTable = document.querySelector(invoiceTableSelector);
        var tableBody = $('.ant-table-tbody', outInvoiceTable)

        var rows = $('tr', tableBody)

        currentPageData = [];
        successes = [];
        $(rows).each((idx, row) => {
            var cells = $('td', row);
            var kihieumauso = $(cells[1]).text().trim();
            var kyhieuhoadon = $(cells[2]).text().trim();
            var sohoadon = $(cells[3]).text().trim();
            var ngaylap = $(cells[4]).text().trim();
            var mstNguoiban = cells[5].innerText.split('\n')[0].split(":")[1].trim();

            currentPageData.push({
                kihieumauso,
                kyhieuhoadon,
                sohoadon,
                ngaylap,
                mstNguoiban
            })
        })

        if (currentPageData.length > 0) {
            await bulkDownloadInvoices(currentPageData)
        }
    }

    async function handleRetry() {
        var result = await bulkDownloadInvoices([...failures])
    }

    async function bulkDownloadInvoices(data) {
        var result = [];
        failures = [];
        $('.download-retry-link', downloadDiv).css('display', 'none');
        $('.download-error', downloadDiv).text('');
        for (var idx = 0; idx < data.length; idx++) {
            var item = data[idx];
            try {
                await downloadInvoice(item);
                successes.push(item);
            } catch (error) {
                console.error(error);
                failures.push(item)
                $('.download-error', downloadDiv).text(`Errors: ${failures.map(({ kyhieuhoadon, sohoadon, ngaylap }) => `${kyhieuhoadon}_${sohoadon}_${ngaylap}`).join(", ")}`)
            } finally {
                $('.download-progress', downloadDiv).text(`${successes.length}/${currentPageData.length} (${failures.length} errors)`);
            }
        }

        if (failures.length > 0) {
            $('.download-retry-link', downloadDiv).text(`Retry ${failures.length} errors`);
            $('.download-retry-link', downloadDiv).css('display', 'block');
        }

        return result;
    }

    async function downloadInvoice(req) {

        var urlParams = new URLSearchParams({
            nbmst: req.mstNguoiban,
            khhdon: req.kyhieuhoadon,
            shdon: req.sohoadon,
            khmshdon: req.kihieumauso
        })

        var response = await fetch(`${EXPORT_URL}?${urlParams.toString()}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtCookie.value}`
            }
        });

        if (!response.ok) {
            throw new Error(response);
        }

        var blob = await response.blob();
        saveAs(blob, `invoice_${req.kyhieuhoadon}_${req.sohoadon}_${req.ngaylap}.zip`);
    }
})();
