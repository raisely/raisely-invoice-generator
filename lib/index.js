const pdfKit = require('pdfkit')
const moment = require('moment')
const numeral = require('numeral')
const i18n = require('./i18n')

const TEXT_SIZE = 8
const CONTENT_LEFT_PADDING = 50

function PDFInvoice({
  company, // {phone, email, address}
  customer, // {name, email}
  items, // [{amount, name, description}]
}){
  const date = new Date()
  const charge = {
    createdAt: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
    amount: items.reduce((acc, item) => acc + item.amount, 0),
  }
  const doc = new pdfKit({size: 'A4', margin: 50});

  doc.fillColor('#333333');

  const translate = i18n[PDFInvoice.lang]
  moment.locale(PDFInvoice.lang)

  const divMaxWidth = 550;
  const table = {
    x: CONTENT_LEFT_PADDING,
    y: 200,
    inc: 250,
  };

  return {
    genHeader(){
      doc
       .fontSize(20)
       .image('data:image/png;base64,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', 0, 15, width: 300)
       .text(company.name, CONTENT_LEFT_PADDING, 50);

      const borderOffset = doc.currentLineHeight() + 70;

      doc
        .fontSize(16)
        .fillColor('#cccccc')
        .text(moment().format('MMMM DD, YYYY'), CONTENT_LEFT_PADDING, 50, {
          align: 'right',
        })
        .fillColor('#333333');

      doc
        .strokeColor('#cccccc')
        .moveTo(CONTENT_LEFT_PADDING, borderOffset)
        .lineTo(divMaxWidth, borderOffset);
    },

    genFooter(){
      doc.fillColor('#cccccc');

      doc
        .fontSize(12)
        .text(company.name, CONTENT_LEFT_PADDING, 450);

      doc.text(company.address);
      doc.text(company.phone);
      doc.text(company.email);

      doc.fillColor('#333333');
    },

    genCustomerInfos(){
      doc
        .fontSize(TEXT_SIZE)
        .text(translate.chargeFor, CONTENT_LEFT_PADDING, 400);

      doc.text(`${customer.name} <${customer.email}>`);
    },

    genTableHeaders(){
      [
        'name',
        'amount'
      ].forEach((text, i) => {
        doc
          .fontSize(TEXT_SIZE)
          .text(translate[text], table.x + i * table.inc, table.y);
      });
    },

    genTableRow(){
      items
        .map(item => Object.assign({}, item, {
          amount: '$' + numeral(item.amount).format('0,00.00')
        }))
        .forEach((item, itemIndex) => {
          [
            'name',
            'amount'
          ].forEach((field, i) => {
            doc
              .fontSize(TEXT_SIZE)
              .text(item[field], table.x + i * table.inc, table.y + TEXT_SIZE + 6 + itemIndex * 20);
          });
        })
    },

    genTableLines(){
      const offset = doc.currentLineHeight() + 2;
      doc
        .moveTo(table.x, table.y + offset)
        .lineTo(divMaxWidth, table.y + offset)
        .stroke();
    },

    generate(){
      this.genHeader();
      this.genTableHeaders();
      this.genTableLines();
      this.genTableRow();
      this.genCustomerInfos();
      this.genFooter();

      doc.end();
    },

    get pdfkitDoc(){
      return doc
    },
  };
}

PDFInvoice.lang = 'en_US'

module.exports = PDFInvoice
