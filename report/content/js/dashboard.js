/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Redirected To ViewEmployeeList"], "isController": false}, {"data": [0.0, 500, 1500, "Redirected To PIM module-0"], "isController": false}, {"data": [0.0, 500, 1500, "TC_ClickPIMAndAddEmployee"], "isController": true}, {"data": [0.0, 500, 1500, "Redirected To PIM module-1"], "isController": false}, {"data": [0.0, 500, 1500, "View Employee page displayed"], "isController": false}, {"data": [0.0, 500, 1500, "Job related information page displayed"], "isController": false}, {"data": [0.0, 500, 1500, "Entered KPI Information"], "isController": false}, {"data": [0.0, 500, 1500, "Supervisor Information Entered"], "isController": false}, {"data": [0.0, 500, 1500, "PIM menu clicked-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login credentials entered-0"], "isController": false}, {"data": [0.0, 500, 1500, "PIM menu clicked-1"], "isController": false}, {"data": [0.0, 500, 1500, "Clicked Job Category menu"], "isController": false}, {"data": [0.0, 500, 1500, "Entered  Supervisor Information"], "isController": false}, {"data": [0.0, 500, 1500, "PersonalDetails Page Displayed"], "isController": false}, {"data": [0.0, 500, 1500, "TC_EnterDetailsAndClickSave"], "isController": true}, {"data": [0.0, 500, 1500, "TC_AddJobCategory"], "isController": true}, {"data": [0.0, 500, 1500, "Supervisor login credentials entered"], "isController": false}, {"data": [0.0, 500, 1500, "TC_AddAdminRights"], "isController": true}, {"data": [0.0, 500, 1500, "TC_Login"], "isController": true}, {"data": [0.0, 500, 1500, "Add button clicked"], "isController": false}, {"data": [0.0, 500, 1500, "TC_AddKPI"], "isController": true}, {"data": [0.0, 500, 1500, "Admin menu Clicked"], "isController": false}, {"data": [0.0, 500, 1500, "Login credentials entered"], "isController": false}, {"data": [0.0, 500, 1500, "TC_AddSuperVisor"], "isController": true}, {"data": [0.0, 500, 1500, "Employee Information page displayed"], "isController": false}, {"data": [0.0, 500, 1500, "Redirected To PIM module"], "isController": false}, {"data": [0.0, 500, 1500, "Login credentials entered-1"], "isController": false}, {"data": [0.0, 500, 1500, "Dashboard Displayed"], "isController": false}, {"data": [0.0, 500, 1500, "Job category page displayed"], "isController": false}, {"data": [0.0, 500, 1500, "TC_Launch"], "isController": true}, {"data": [0.0, 500, 1500, "PIM menu clicked"], "isController": false}, {"data": [0.0, 500, 1500, "Application Launched"], "isController": false}, {"data": [0.0, 500, 1500, "Entered Job Information"], "isController": false}, {"data": [0.0, 500, 1500, "Admin menu Clicked-0"], "isController": false}, {"data": [0.0, 500, 1500, "Admin menu Clicked-1"], "isController": false}, {"data": [0.0, 500, 1500, "Employee Details filled"], "isController": false}, {"data": [0.0, 500, 1500, "Redirected to Admin module"], "isController": false}, {"data": [0.0, 500, 1500, "TC_EnterDetailsAnd ClickSave"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 29, 0, 0.0, 10598.689655172415, 3516, 32121, 9050.0, 18509.0, 26570.0, 32121.0, 0.10745954518673875, 0.27547002550311445, 0.1041882820924226], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Redirected To ViewEmployeeList", 1, 0, 0.0, 9972.0, 9972, 9972, 9972.0, 9972.0, 9972.0, 9972.0, 0.10028078620136381, 0.2943789485559567, 0.08333881743882872], "isController": false}, {"data": ["Redirected To PIM module-0", 1, 0, 0.0, 8592.0, 8592, 8592, 8592.0, 8592.0, 8592.0, 8592.0, 0.11638733705772812, 0.18003666201117316, 0.0963832635009311], "isController": false}, {"data": ["TC_ClickPIMAndAddEmployee", 2, 0, 0.0, 28100.5, 26079, 30122, 28100.5, 30122.0, 30122.0, 30122.0, 0.014707720818043432, 0.13079673791944582, 0.042737132123133036], "isController": true}, {"data": ["Redirected To PIM module-1", 1, 0, 0.0, 7513.0, 7513, 7513, 7513.0, 7513.0, 7513.0, 7513.0, 0.1331026221216558, 0.39072898642353254, 0.11061555803274324], "isController": false}, {"data": ["View Employee page displayed", 1, 0, 0.0, 5931.0, 5931, 5931, 5931.0, 5931.0, 5931.0, 5931.0, 0.1686056314280897, 0.4949497344461305, 0.14012050033721127], "isController": false}, {"data": ["Job related information page displayed", 1, 0, 0.0, 9189.0, 9189, 9189, 9189.0, 9189.0, 9189.0, 9189.0, 0.10882576994232235, 0.1401769439003156, 0.08385110594188704], "isController": false}, {"data": ["Entered KPI Information", 1, 0, 0.0, 3639.0, 3639, 3639, 3639.0, 3639.0, 3639.0, 3639.0, 0.2748007694421544, 0.30163678208298983, 0.23454675048090137], "isController": false}, {"data": ["Supervisor Information Entered", 1, 0, 0.0, 10581.0, 10581, 10581, 10581.0, 10581.0, 10581.0, 10581.0, 0.09450902561194593, 0.09884684221718175, 0.08038804815234855], "isController": false}, {"data": ["PIM menu clicked-0", 1, 0, 0.0, 4015.0, 4015, 4015, 4015.0, 4015.0, 4015.0, 4015.0, 0.24906600249066002, 0.38527397260273977, 0.20625778331257785], "isController": false}, {"data": ["Login credentials entered-0", 1, 0, 0.0, 16943.0, 16943, 16943, 16943.0, 16943.0, 16943.0, 16943.0, 0.059021424777194124, 0.09521815794133269, 0.06576508366286962], "isController": false}, {"data": ["PIM menu clicked-1", 1, 0, 0.0, 6208.0, 6208, 6208, 6208.0, 6208.0, 6208.0, 6208.0, 0.16108247422680413, 0.4728651538337629, 0.1338683452802835], "isController": false}, {"data": ["Clicked Job Category menu", 1, 0, 0.0, 4950.0, 4950, 4950, 4950.0, 4950.0, 4950.0, 4950.0, 0.20202020202020202, 0.9073153409090908, 0.1749921085858586], "isController": false}, {"data": ["Entered  Supervisor Information", 1, 0, 0.0, 7437.0, 7437, 7437, 7437.0, 7437.0, 7437.0, 7437.0, 0.1344628210299852, 0.14588690836358748, 0.11305907119806373], "isController": false}, {"data": ["PersonalDetails Page Displayed", 1, 0, 0.0, 21019.0, 21019, 21019, 21019.0, 21019.0, 21019.0, 21019.0, 0.04757600266425615, 0.29906907143536804, 0.03944533814643894], "isController": false}, {"data": ["TC_EnterDetailsAndClickSave", 1, 0, 0.0, 13318.0, 13318, 13318, 13318.0, 13318.0, 13318.0, 13318.0, 0.07508634930169694, 0.15039267814236373, 0.11930223663462983], "isController": true}, {"data": ["TC_AddJobCategory", 1, 0, 0.0, 32964.0, 32964, 32964, 32964.0, 32964.0, 32964.0, 32964.0, 0.030336124256764956, 0.24796226565344012, 0.09859240383448611], "isController": true}, {"data": ["Supervisor login credentials entered", 1, 0, 0.0, 7755.0, 7755, 7755, 7755.0, 7755.0, 7755.0, 7755.0, 0.1289490651192779, 0.15136403932946485, 0.11006004190844616], "isController": false}, {"data": ["TC_AddAdminRights", 1, 0, 0.0, 29780.0, 29780, 29780, 29780.0, 29780.0, 29780.0, 29780.0, 0.0335795836131632, 0.3125459095869711, 0.11464279717931497], "isController": true}, {"data": ["TC_Login", 1, 0, 0.0, 38553.0, 38553, 38553, 38553.0, 38553.0, 38553.0, 38553.0, 0.02593831867818328, 0.18526646759007082, 0.075357908269136], "isController": true}, {"data": ["Add button clicked", 1, 0, 0.0, 13967.0, 13967, 13967, 13967.0, 13967.0, 13967.0, 13967.0, 0.07159733657907927, 0.21122612676308442, 0.05950130217655903], "isController": false}, {"data": ["TC_AddKPI", 1, 0, 0.0, 3639.0, 3639, 3639, 3639.0, 3639.0, 3639.0, 3639.0, 0.2748007694421544, 0.30163678208298983, 0.23454675048090137], "isController": true}, {"data": ["Admin menu Clicked", 1, 0, 0.0, 18509.0, 18509, 18509, 18509.0, 18509.0, 18509.0, 18509.0, 0.05402777027392079, 0.2616442507698957, 0.09222709222540386], "isController": false}, {"data": ["Login credentials entered", 1, 0, 0.0, 32121.0, 32121, 32121, 32121.0, 32121.0, 32121.0, 32121.0, 0.03113228106223343, 0.13629493750194577, 0.0640887192179571], "isController": false}, {"data": ["TC_AddSuperVisor", 1, 0, 0.0, 7437.0, 7437, 7437, 7437.0, 7437.0, 7437.0, 7437.0, 0.1344628210299852, 0.14588690836358748, 0.11305907119806373], "isController": true}, {"data": ["Employee Information page displayed", 1, 0, 0.0, 9050.0, 9050, 9050, 9050.0, 9050.0, 9050.0, 9050.0, 0.11049723756906077, 0.10542558701657458, 0.08168594613259668], "isController": false}, {"data": ["Redirected To PIM module", 1, 0, 0.0, 16107.0, 16107, 16107, 16107.0, 16107.0, 16107.0, 16107.0, 0.06208480784751971, 0.278290300800894, 0.1030098520829453], "isController": false}, {"data": ["Login credentials entered-1", 1, 0, 0.0, 15172.0, 15172, 15172, 15172.0, 15172.0, 15172.0, 15172.0, 0.0659108884787767, 0.18222043484708672, 0.06224202066306354], "isController": false}, {"data": ["Dashboard Displayed", 1, 0, 0.0, 6432.0, 6432, 6432, 6432.0, 6432.0, 6432.0, 6432.0, 0.15547263681592038, 0.4298271824471393, 0.13163552355410446], "isController": false}, {"data": ["Job category page displayed", 1, 0, 0.0, 7394.0, 7394, 7394, 7394.0, 7394.0, 7394.0, 7394.0, 0.1352447930754666, 0.14184854273735462, 0.09443362016499865], "isController": false}, {"data": ["TC_Launch", 1, 0, 0.0, 16919.0, 16919, 16919, 16919.0, 16919.0, 16919.0, 16919.0, 0.05910514805839588, 0.13165902609492286, 0.04075022903244872], "isController": true}, {"data": ["PIM menu clicked", 1, 0, 0.0, 10224.0, 10224, 10224, 10224.0, 10224.0, 10224.0, 10224.0, 0.09780907668231612, 0.4384215448943662, 0.1622828332844288], "isController": false}, {"data": ["Application Launched", 1, 0, 0.0, 16919.0, 16919, 16919, 16919.0, 16919.0, 16919.0, 16919.0, 0.05910514805839588, 0.13165902609492286, 0.04075022903244872], "isController": false}, {"data": ["Entered Job Information", 1, 0, 0.0, 11431.0, 11431, 11431, 11431.0, 11431.0, 11431.0, 11431.0, 0.08748141020033243, 0.11772400708599423, 0.08004890757589013], "isController": false}, {"data": ["Admin menu Clicked-0", 1, 0, 0.0, 11213.0, 11213, 11213, 11213.0, 11213.0, 11213.0, 11213.0, 0.08918219923303308, 0.1383891743957906, 0.07611840051725677], "isController": false}, {"data": ["Admin menu Clicked-1", 1, 0, 0.0, 7295.0, 7295, 7295, 7295.0, 7295.0, 7295.0, 7295.0, 0.13708019191226867, 0.45113305346127486, 0.11700008567511995], "isController": false}, {"data": ["Employee Details filled", 1, 0, 0.0, 4268.0, 4268, 4268, 4268.0, 4268.0, 4268.0, 4268.0, 0.23430178069353327, 0.24574229732895972, 0.19906498945641987], "isController": false}, {"data": ["Redirected to Admin module", 1, 0, 0.0, 3516.0, 3516, 3516, 3516.0, 3516.0, 3516.0, 3516.0, 0.2844141069397042, 0.9360112699089875, 0.24275188424345848], "isController": false}, {"data": ["TC_EnterDetailsAnd ClickSave", 1, 0, 0.0, 31600.0, 31600, 31600, 31600.0, 31600.0, 31600.0, 31600.0, 0.03164556962025317, 0.23202630537974683, 0.053154667721518986], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 29, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
