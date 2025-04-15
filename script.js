let assetsData = [];

// تحميل ملف Excel من نفس المجلد
fetch('assetv4.xlsx')
    .then(response => response.arrayBuffer())
    .then(data => {
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        assetsData = XLSX.utils.sheet_to_json(sheet);
    });

// البحث وعرض النتائج
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const results = assetsData.filter(item => 
        item['Asset Description For Maintenance Purpose']?.toLowerCase().includes(searchTerm)
    );

    let html = '<ul>';
    results.forEach(item => {
        html += `
            <li onclick="showDetails('${item['Unique Asset Number in the entity']}')">
                ${item['Asset Description For Maintenance Purpose']}
            </li>
        `;
    });
    html += '</ul>';
    document.getElementById('results').innerHTML = html;
});

// عرض التفاصيل
function showDetails(assetId) {
    const asset = assetsData.find(item => item['Unique Asset Number in the entity'] === assetId);
    let html = `
        <div class="details-box">
            <h2>${asset['Asset Description For Maintenance Purpose']}</h2>
            <p><strong>الموقع:</strong> ${asset['City']}, ${asset['Region']}</p>
            <p><strong>التكلفة:</strong> ${asset['Cost']} ريال</p>
            <button onclick="showAccounting('${assetId}')">عرض التفاصيل المحاسبية</button>
        </div>
    `;
    document.getElementById('details').innerHTML = html;
}

// عرض البيانات المحاسبية
function showAccounting(assetId) {
    const asset = assetsData.find(item => item['Unique Asset Number in the entity'] === assetId);
    let html = `
        <div class="accounting-box">
            <h3>بيانات محاسبية:</h3>
            <p>الاستهلاك المتراكم: ${asset['Accumulated Depreciation']}</p>
            <p>القيمة الدفترية: ${asset['Net Book Value']}</p>
            <p>العمر الإنتاجي: ${asset['Useful Life']} سنوات</p>
        </div>
    `;
    document.getElementById('details').innerHTML += html;
}
