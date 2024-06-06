function generateInvoice(data) {
    // Insert seller details
    document.getElementById('seller-details').innerText = `
        Name: ${data.seller.name}
        Address: ${data.seller.address}
        ${data.seller.city}, ${data.seller.state}, ${data.seller.pincode}
        PAN No.: ${data.seller.pan}
        GST Registration No.: ${data.seller.gst}
    `;

    // Insert billing details
    document.getElementById('billing-details').innerText = `
        Name: ${data.billing.name}
        Address: ${data.billing.address}
        ${data.billing.city}, ${data.billing.state}, ${data.billing.pincode}
        State/UT Code: ${data.billing.stateCode}
    `;

    // Insert shipping details
    document.getElementById('shipping-details').innerText = `
        Name: ${data.shipping.name}
        Address: ${data.shipping.address}
        ${data.shipping.city}, ${data.shipping.state}, ${data.shipping.pincode}
        State/UT Code: ${data.shipping.stateCode}
        Place of Supply: ${data.placeOfSupply}
        Place of Delivery: ${data.placeOfDelivery}
    `;

    // Insert order details
    document.getElementById('order-details').innerText = `
        Order No.: ${data.order.number}
        Order Date: ${data.order.date}
    `;

    // Insert invoice details
    document.getElementById('invoice-details').innerText = `
        Invoice No.: ${data.invoice.number}
        Invoice Details: ${data.invoice.details}
        Invoice Date: ${data.invoice.date}
    `;

    // Compute and insert item details
    let itemsBody = document.getElementById('items-body');
    let totalAmount = 0;
    let totalTax = 0;

    data.items.forEach(item => {
        let netAmount = item.unitPrice * item.quantity - item.discount;
        let taxRate = item.taxRate / 100;
        let taxAmount = netAmount * taxRate;
        let taxType = (data.placeOfSupply === data.placeOfDelivery) ? `CGST ${taxRate / 2 * 100}% + SGST ${taxRate / 2 * 100}%` : `IGST ${taxRate * 100}%`;
        let totalItemAmount = netAmount + taxAmount;
        totalTax += taxAmount;
        totalAmount += totalItemAmount;

        let row = `
            <tr>
                <td>${item.description}</td>
                <td>${item.unitPrice.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>${item.discount.toFixed(2)}</td>
                <td>${netAmount.toFixed(2)}</td>
                <td>${item.taxRate}%</td>
                <td>${taxType}</td>
                <td>${taxAmount.toFixed(2)}</td>
                <td>${totalItemAmount.toFixed(2)}</td>
            </tr>
        `;
        itemsBody.innerHTML += row;
    });

    // Insert total amount and amount in words
    document.getElementById('total-tax').innerText = totalTax.toFixed(2);
    document.getElementById('total-amount').innerText = totalAmount.toFixed(2);
    document.getElementById('amount-in-words').innerText = "Amount in words: " + numToWord(totalAmount.toFixed(2));

    // Insert signature and seller name
    document.getElementById('seller-name').innerText = data.seller.name;
    document.getElementById('signature-image').src = data.signatureImage;
    document.getElementById('rev-chrg').innerText = 'Whether tax is payable under reverse charge: ' + data.reverseCharge;
}

// Function to convert number to words (simplified)
function numToWord(n) {
    var nums = n.toString().split('.')
    var whole = numberToWords(nums[0])
    if (nums.length == 2) {
        var fraction = numberToWords(nums[1])
        return whole + ' point ' + fraction;
    } else {
        return whole;
    }
}
const numbersToWords = {
    0: "zero",
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
    10: "ten",
    11: "eleven",
    12: "twelve",
    13: "thirteen",
    14: "fourteen",
    15: "fifteen",
    16: "sixteen",
    17: "seventeen",
    18: "eighteen",
    19: "nineteen",
    20: "twenty",
    30: "thirty",
    40: "forty",
    50: "fifty",
    60: "sixty",
    70: "seventy",
    80: "eighty",
    90: "ninety",
};

function numberToWords(number) {
    if (number in numbersToWords) return numbersToWords[number];

    let words = "";

    if (number >= 100) {
        words += numberToWords(Math.floor(number / 100)) + " hundred";
        number %= 100;
    }

    if (number > 0) {
        if (words !== "") words += " and ";
        if (number < 20) words += numbersToWords[number];
        else {
            words += numbersToWords[Math.floor(number / 10) * 10];
            if (number % 10 > 0) words += "-" + numbersToWords[number % 10];
        }
    }

    return words;
}

// Example data to generate invoice
const data = {
    seller: {
        name: "ABC Pvt Ltd",
        address: "123 Street",
        city: "City",
        state: "State",
        pincode: "123456",
        pan: "ABCDE1234F",
        gst: "27ABCDE1234F1Z5"
    },
    placeOfSupply: "State",
    billing: {
        name: "Customer Name",
        address: "456 Avenue",
        city: "City",
        state: "State",
        pincode: "654321",
        stateCode: "27"
    },
    shipping: {
        name: "Customer Name",
        address: "456 Avenue",
        city: "City",
        state: "State",
        pincode: "654321",
        stateCode: "27"
    },
    placeOfDelivery: "State",
    order: {
        number: "ORD123456",
        date: "2024-06-05"
    },
    invoice: {
        number: "INV123456",
        details: "ORD123456",
        date: "2024-06-06"
    },
    reverseCharge: "No",
    items: [
        { description: "Item 1", unitPrice: 100, quantity: 2, discount: 10, taxRate: 18 },
        { description: "Item 2", unitPrice: 200, quantity: 1, discount: 20, taxRate: 18 }
    ],
    signatureImage: "signature.png"
};

// Generate the invoice
generateInvoice(data);


// Function to generate PDF
document.getElementById('download').addEventListener('click', () => {
    const element = document.getElementById('content');
    html2pdf(element, {
        margin: 0,
        filename: 'invoice.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    });
});