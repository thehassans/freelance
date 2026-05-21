import React from 'react';
import { Check } from 'lucide-react';

const InvoiceSEO: React.FC = () => {
  return (
    <section className="mt-24 space-y-24 max-w-4xl mx-auto border-t border-slate-200 pt-24 pb-24 px-4 sm:px-0">
      {/* GST Requirements in Pakistan */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-6">GST Requirements for Businesses in Pakistan</h3>
        <p className="text-lg leading-relaxed text-slate-600 mb-6">
          In Pakistan, the General Sales Tax (GST) is managed by the Federal Board of Revenue (FBR) for goods, while provincial authorities (SRB, PRA, BRA, KRA) manage sales tax on services. Under the Sales Tax Act 1990, any person making taxable supplies in the course of their business is required to register for GST and issue proper tax invoices.
        </p>
        <p className="text-lg leading-relaxed text-slate-600">
          Manufacturers with annual turnover above PKR 10 million, importers, and exporters are required to register for GST with the FBR. Service providers register with their respective provincial revenue authority. Refrens online invoice generator supports both goods and services invoice formats for Pakistani businesses.
        </p>
      </div>

      {/* What is a Tax Invoice */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-4">What is a Tax Invoice in Pakistan? — Invoice Generator Guide</h3>
        <p className="text-lg leading-relaxed text-slate-600">
          A sales tax invoice in Pakistan is the official billing document for FBR-registered businesses supplying taxable goods or services. It is the document your business client uses to claim input tax adjustments on their GST return — reducing the net GST they owe to the FBR. Issuing an incomplete or non-compliant invoice can trigger FBR penalties and block your client's input tax claim, damaging business relationships.
        </p>
      </div>

      {/* Valid Pakistan Sales Tax Invoice Must Include */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-6">What a Valid Pakistan Sales Tax Invoice Must Include</h3>
        <p className="text-lg leading-relaxed text-slate-600 mb-8">
          Refrens online invoice generator ensures every invoice you create meets FBR requirements:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
             <span className="block font-black text-slate-900 mb-2">"Tax Invoice"</span>
             <p className="text-slate-600">Clearly labelled at the top</p>
           </div>
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
             <span className="block font-black text-slate-900 mb-2">Supplier Details</span>
             <p className="text-slate-600">Supplier's name, address, NTN, and STRN — your FBR-registered details</p>
           </div>
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
             <span className="block font-black text-slate-900 mb-2">Sequential Data</span>
             <p className="text-slate-600">Invoice date and sequential invoice number</p>
           </div>
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
             <span className="block font-black text-slate-900 mb-2">Buyer Information</span>
             <p className="text-slate-600">Buyer's name, address, and NTN/STRN — for input tax adjustment claims</p>
           </div>
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
             <span className="block font-black text-slate-900 mb-2">Goods/Services</span>
             <p className="text-slate-600">Description of goods or services — with HS code for goods</p>
           </div>
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
             <span className="block font-black text-slate-900 mb-2">Line Items</span>
             <p className="text-slate-600">Quantity, unit price, and value excluding GST — per line item</p>
           </div>
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
             <span className="block font-black text-slate-900 mb-2">GST Details</span>
             <p className="text-slate-600">GST rate (18% or applicable rate) and GST amount — clearly separated</p>
           </div>
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
             <span className="block font-black text-slate-900 mb-2">Total Amount</span>
             <p className="text-slate-600">Total amount payable — in Pakistani Rupee (PKR)</p>
           </div>
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 md:col-span-2">
             <span className="block font-black text-slate-900 mb-2">FBR Reference</span>
             <p className="text-slate-600">FBR invoice reference number — for businesses on the PRAL e-invoicing system</p>
           </div>
        </div>
        <p className="mt-8 text-lg leading-relaxed text-slate-600">
          Use Refrens free invoice generator to draft and organise invoice details before submitting through PRAL — keeping your FBR records accurate and reducing the risk of audit discrepancies.
        </p>
      </div>

      {/* Invoice Definition & Concepts */}
      <div className="space-y-12">
        <div>
          <h3 className="text-2xl font-black text-slate-900 mb-4">Invoice Definition - What is an Invoice?</h3>
          <p className="text-lg leading-relaxed text-slate-600">
            An invoice summarizes the transactions between the buyer(customer) and the seller(vendor) for the sales of goods or services. It showcases the total amount to be paid for the services or products rendered by the customer. It holds all the necessary information like buyer details, seller details, reference number, product/service description, quantity, rate, tax amount, terms, and conditions of the payment. It also has information about the available payment mode for the buyer.
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 mb-4">Online Invoice - What is an Online Invoice?</h3>
          <div className="text-lg leading-relaxed text-slate-600 space-y-4">
            <p>
              An invoice created using either Google Docs, Google Sheets, online invoice templates, or using an invoice software like Refrens is considered as online invoicing. It holds the same information as traditional invoices do. Creating invoices online is easy and also saves your hard-earned time which you can utilize further for business growth. It is always harder to create invoice online at the end of the month and search for the older invoices.
            </p>
            <p>
              So using an invoice maker like Refrens, less to no Paperwork is required and also no risk of losing invoices. You can easily create invoices, manage, send and track all your invoice in one place. No fear of losing your invoices and can also access them whenever you required them. The best part about Refrens is - you can create invoices online without paying a single penny. FREE INVOICES FOR LIFETIME.
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 mb-6">Invoice Purpose - What is an invoice used for?</h3>
          <p className="text-lg leading-relaxed text-slate-600 mb-8">
            Invoice is one of the major business documents used for accounting purposes. Using invoice, one can easily manage and track all the payment received and due from a particular client. It helps businesses to record all the sales transactions happening between both the parties, i.e.: between client and vendor. Here are some other reasons why one should invoice in business:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "One of the best ways to accept payment from the clients.",
              "To track future growth of the business.",
              "To keep track of sales.",
              "To keep track of inventory.",
              "Easy to file tax returns.",
              "Proof of sales happened between both the parties.",
              "Easy to track pending payments.",
              "Legal protection against lawsuits."
            ].map((purpose, i) => (
              <div key={`purpose-${i}`} className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="bg-emerald-100 text-emerald-600 rounded-full p-1 mt-1 shrink-0"><Check size={16} /></div>
                <p className="text-slate-700 font-medium">{purpose}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invoice Generator Intro */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-4">Invoice Generator</h3>
        <p className="text-lg leading-relaxed text-slate-600">
          An invoice generator or free invoice maker is a tool used to create an invoice online without any hassle or error. Using an online invoice generator, create invoices, send PDF invoices, customize invoices with invoice templates, download or print invoices etc. which is not possible in handwritten invoices. It has become easy for small business owners and freelancers to automate the invoicing process using a free invoice generator.
        </p>
      </div>

      {/* Q&A styled sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">What is the difference between invoice and receipt?</h3>
          <p className="text-slate-600 leading-relaxed">
            An invoice is a document asking for the payment. Whereas the receipt is a proof of payment done by the buyer to seller. A receipt is proof that the buyer has received the goods or services from the seller. You can create both invoice and payment receipt on Refrens using invoice maker.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">What is an invoice format?</h3>
          <p className="text-slate-600 leading-relaxed">
            An invoice format is basically the invoice template or layout. An invoice format breaks all the elements of invoice in a simple format so that it becomes easy for you to create invoice online. For different professions, there are different invoice format like consultant invoice format.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Who can issue the invoice?</h3>
          <p className="text-slate-600 leading-relaxed">
            Generally, the supplier issues the invoice for the goods or services they offer to the customer.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">What is the difference between an invoice and a bill?</h3>
          <p className="text-slate-600 leading-relaxed">
            Yes, both are the same and portray the same information. Only difference is that invoice is issued by the supplier or the business providing the products or services. The same invoice is recorded as a bill for the customer or the person receiving the products or service.
          </p>
        </div>
      </div>

      {/* How Online Invoice Saves your Time */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-6">How Online Invoice Saves your Time?</h3>
        <p className="text-lg leading-relaxed text-slate-600 mb-8">
          Use an invoice maker like Refrens can help you to save a lot of time and energy, thus helps you to focus on growing your business. Here are some of the reasons:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {[
             "Easily generate invoices instantly.",
             "Autosave your client data and item description for further use.",
             "Organize all your invoice in seconds.",
             "Get Essential Business Reports.",
             "Use professional templates that are compatible with printers.",
             "Track all your invoices - know if the customer opened your mail.",
             "Share your invoices quickly via email or WhatsApp share.",
             "Check Invoice status - paid, unpaid, overdue, part-paid.",
             "Access your invoice and client data from anywhere in the world.",
             "Use other free tools offered by Refrens"
           ].map((benefit, i) => (
              <div key={`benefit-${i}`} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4"><Check size={18} /></div>
                <p className="font-semibold text-slate-800">{benefit}</p>
              </div>
           ))}
        </div>
      </div>

      {/* Types of invoices */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-6">What are the types of invoices in Invoice Generator Software?</h3>
        <p className="text-lg leading-relaxed text-slate-600 mb-8">
          There are a total 6 types of invoices created in a business according to the needs and requirements. All the invoices mentioned below carry different purposes in invoicing. Creating the right type of invoice for the right client at the right time is extremely important to get sales done and get paid faster.
        </p>
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="md:w-1/4">
              <h4 className="text-lg font-bold text-slate-900">Standard Invoice</h4>
            </div>
            <div className="md:w-3/4 text-slate-600">
              Standard invoice is a normal invoice created by the vendor for the client which includes all the basic details like invoice date, invoice number, payment due date, vendor address, client address, product or service name with quantity, rate, subtotal and total amount.
            </div>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="md:w-1/4">
              <h4 className="text-lg font-bold text-slate-900">Proforma Invoice</h4>
            </div>
            <div className="md:w-3/4 text-slate-600">
              Proforma invoice is a non legal invoice created for the supplier to make agreement between both the parties for the payment terms and committing to deliver the products or services at a specified date and time. You can create the proforma invoice template here.
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="md:w-1/4">
              <h4 className="text-lg font-bold text-slate-900">Service Invoice</h4>
            </div>
            <div className="md:w-3/4 text-slate-600">
              Service invoice is usually created by service based businesses who do not deal with the products. Service businesses like digital marketers, lawyers, Shopify developers, consultants etc. charge their client hourly rather than quantity wise for the services. Using our free invoice generator, you can easily use the “Add/Rename Column” feature to hide, add or edit the column name and can charge hourly.
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="md:w-1/4">
              <h4 className="text-lg font-bold text-slate-900">Commercial Invoice</h4>
            </div>
            <div className="md:w-3/4 text-slate-600">
              Commercial invoices are used by the export/import business owners which include slightly more information than a standard invoice. It has all the information similar to standard invoice and extra information like shipping details, country of supply, place of supply, total packages to be delivered and weight of the packages.
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="md:w-1/4">
              <h4 className="text-lg font-bold text-slate-900">Recurring Invoice</h4>
            </div>
            <div className="md:w-3/4 text-slate-600">
              Recurring invoices are created by the businesses who charge fixed prices from their client and are charged either on a weekly or monthly basis like apartment rent, bills, subscription or any fixed price software. Recurring invoice is created and sent to the client on a monthly basis until the client cancels or ends the contract or subscription.
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="md:w-1/4">
              <h4 className="text-lg font-bold text-slate-900">Credit Note</h4>
            </div>
            <div className="md:w-3/4 text-slate-600">
              Credit note is issued by the supplier when the client returns the product for reasons like damage or mistake. Here on Refrens, you can create all the above invoices easily without any hassle using our online invoice maker.
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Number */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-6">Invoice Number - Basics Explained in Invoice Generator</h3>
        <div className="space-y-8">
          <div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">What is an invoice number?</h4>
            <p className="text-lg leading-relaxed text-slate-600">
              An invoice number is one of the most important elements of the invoice. Invoice number helps to track and organize each invoice you create. When creating invoice, invoice number should be unique for every invoice and also it should be sequentially followed. Invoice numbers can contain both numbers and alphabets. For example: When the first invoice is created, you can assign invoice number either 001 or INV/001. The same should be followed when creating the second invoice, it can be either 001 or INV/002.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900 mb-4">How to assign invoice number when using online invoice maker?</h4>
            <p className="text-lg leading-relaxed text-slate-600 mb-6">
              There are numerous methods to adding the invoice number when using the invoice maker. Of which the best methods are as followers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h5 className="font-bold text-slate-900 mb-2">Sequential Method</h5>
                <p className="text-slate-600 text-sm">
                  This is the most common and easy method to assign the invoice number and also used by most of the businesses. Here your invoice number is in increasing order and starts from 1. For example: Invoice No 001, Invoice No 002, Invoice No 003 and so on or 2021/INV/001, 2021/INV/002, 2021/INV/003 and so on.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h5 className="font-bold text-slate-900 mb-2">Date Wise Method</h5>
                <p className="text-slate-600 text-sm">
                  Here, you use the date and unique number as the invoice number. For example: If you are issuing the invoice on April 23, 2021 then you can have the invoice number 2021-04-23-001. Here it becomes easy to track the invoice, date wise.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h5 className="font-bold text-slate-900 mb-2">Project/Client Id Method</h5>
                <p className="text-slate-600 text-sm">
                  Many businesses work on different projects. Here you can assign the project number as the invoice number. For example, if you have completed the project number 185, then you can assign invoice number 185. Or issue by Client ID like 387-001.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Guide */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-6">How to Make an Invoice Online using Free Invoice Generator?</h3>
        <p className="text-lg leading-relaxed text-slate-600 mb-8">
          When creating an invoice for the first time, you have to add the invoicing details to the blank invoice. Here is the step by step guide on how to make an invoice using all the essential elements of a free invoice generator. You only need a mobile or laptop or desktop with internet connection.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <div className="flex gap-4">
             <div className="w-10 h-10 shrink-0 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">1</div>
             <div>
               <h4 className="font-bold text-slate-900 mb-2">Invoice Header</h4>
               <p className="text-slate-600 text-sm">This is the section where you add the invoice number, Issue and Due Date of the invoice. You can also add the company or business logo to look more professional.</p>
             </div>
           </div>
           <div className="flex gap-4">
             <div className="w-10 h-10 shrink-0 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">2</div>
             <div>
               <h4 className="font-bold text-slate-900 mb-2">Billed By</h4>
               <p className="text-slate-600 text-sm">It means to add the information of the seller(vendor) who is offering the product or service. It holds all the information of the seller like business name, address, email, phone number.</p>
             </div>
           </div>
           <div className="flex gap-4">
             <div className="w-10 h-10 shrink-0 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">3</div>
             <div>
               <h4 className="font-bold text-slate-900 mb-2">Billed To</h4>
               <p className="text-slate-600 text-sm">Opposite to billed by, billed to holds all the necessary information of the buyer of the product or service. It holds all the information about the buyer.</p>
             </div>
           </div>
           <div className="flex gap-4">
             <div className="w-10 h-10 shrink-0 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">4</div>
             <div>
               <h4 className="font-bold text-slate-900 mb-2">Tax</h4>
               <p className="text-slate-600 text-sm">Add your tax rate, it will auto calculate your tax amount and the final amount of the invoice.</p>
             </div>
           </div>
           <div className="flex gap-4">
             <div className="w-10 h-10 shrink-0 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">5</div>
             <div>
               <h4 className="font-bold text-slate-900 mb-2">Product/Service Details</h4>
               <p className="text-slate-600 text-sm">Add the product/service name and description along with the quantity and rate of the particular product offered by the seller.</p>
             </div>
           </div>
           <div className="flex gap-4">
             <div className="w-10 h-10 shrink-0 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">6</div>
             <div>
               <h4 className="font-bold text-slate-900 mb-2">Discounts & Charges</h4>
               <p className="text-slate-600 text-sm">You can give discounts on the item that you sold. Refrens’ online invoice generator automatically calculates the discounts & additional charges.</p>
             </div>
           </div>
           <div className="flex gap-4">
             <div className="w-10 h-10 shrink-0 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">7</div>
             <div>
               <h4 className="font-bold text-slate-900 mb-2">Terms & Conditions</h4>
               <p className="text-slate-600 text-sm">Add your company or invoicing terms and conditions so that you can get paid faster or to be clear on the record.</p>
             </div>
           </div>
           <div className="flex gap-4">
             <div className="w-10 h-10 shrink-0 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">8</div>
             <div>
               <h4 className="font-bold text-slate-900 mb-2">Additional Notes</h4>
               <p className="text-slate-600 text-sm">As the name suggests, you can add extra information or instruction related to the product or service you offered.</p>
             </div>
           </div>
           <div className="flex gap-4">
             <div className="w-10 h-10 shrink-0 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">9</div>
             <div>
               <h4 className="font-bold text-slate-900 mb-2">Customize Invoice</h4>
               <p className="text-slate-600 text-sm">Once the invoice is created you can customize the invoice as per your requirement by changing the invoice template, or changing the color of the invoice.</p>
             </div>
           </div>
        </div>
      </div>

      {/* Mistakes */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-4">What are the invoicing mistakes to avoid when you create invoice online?</h3>
        <ul className="list-disc pl-6 space-y-4 text-lg text-slate-600 marker:text-slate-400">
           <li><strong className="text-slate-900">Incorrect invoice date</strong> - The date should be correct in it should be the date when the invoice was created.</li>
           <li><strong className="text-slate-900">Incomplete details</strong> - Invoice must have all the details of the vendor or service provider and client details. It should include all the detailed information about the product or service offered.</li>
           <li><strong className="text-slate-900">Spelling mistakes</strong> - Avoid spelling mistakes when creating the invoice. Create an invoice in simple terms and language. Avoid using technical jargon or the short form of any word.</li>
           <li><strong className="text-slate-900">Incorrect total</strong> - The price and quantity decided at the time of agreement is different and the invoice created for the same agreement is different. This is the most common cause of the rejection of the invoice. Avoid adding the wrong tax rate.</li>
        </ul>
      </div>

      {/* Frequently Asked Questions */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-8">Frequently Asked Questions (FAQ)</h3>
        <div className="space-y-4">
           {[
             {
               q: "What is an invoice?",
               a: "An invoice is a business financial document that a seller gives to a buyer. It acts like a bill. The invoice shows what products or services the seller gave, how much each one cost, and the total money the buyer needs to pay. The invoice is important because it asks the buyer for money and keeps a record of the transaction for both the buyer and the seller."
             },
             {
               q: "How to use invoice generator online?",
               a: "Refrens invoice generator allows you to create invoices for free without taking much time. Head over to Refrens invoice generator and start creating invoices using pre-formatted invoice templates. You can add your logo, brand colors, and multiple invoice templates and use many more such features to keep your brand consistent."
             },
             {
               q: "What is an invoice generator?",
               a: "Invoice generator or free invoice maker is a software tool used to create invoices online which is similar to handwritten invoices or created using excel sheet. It includes all the basics of an invoice like company logo, invoice title, invoice date, company and client details, product or service sold, quantity, rate and information related to tax and payment details. Send PDF invoices, customize invoices with invoice templates, download or print invoices etc. which is not possible in handwritten invoices."
             },
             {
               q: "Is Refrens invoice generator free?",
               a: "FREE! Refrens invoice generator is free for every small business, agency, startup, and entrepreneur. You can generate 15 documents every year. Also, manage invoices and access free templates."
             },
             {
               q: "Are there Multiple Invoice Templates?",
               a: "Yes, there are multiple invoice templates on Refrens you can use. Not just templates, you can also change the color of each template and font headings as well."
             },
             {
               q: "Can I create a recurring invoice online?",
               a: "Yes, you can create weekly, monthly, and yearly recurring invoices on Refrens. You can also customize the dates as per your requirements."
             },
             {
               q: "Do I need to sign up to use this invoice maker?",
               a: "Yes, Refrens account is necessary to use this invoice generator. While creating an account, you can access all the invoices in one place and also make the invoice creation process easy."
             },
             {
               q: "Can I add Custom Fields while generating invoices online?",
               a: "Yes, you can add additional fields and columns as well. Refrens allow extra fields that help you to add more information about the company or product/service you offer."
             },
             {
               q: "Can I save the invoice created online?",
               a: "Yes. All the invoices created by you are saved online. You can access all the invoices anytime just by logging into your account."
             },
             {
               q: "Can I do client management and save information for further invoicing requirements?",
               a: "Yes, you can save and manage all the details of your client under client management tab. This feature helps you to avoid retying of customer details every time on the invoice."
             },
             {
               q: "Is my data secure?",
               a: "Yes. Your data is stored securely with encryption and cloud protection. We are ISO/IEC 27001:2022 certified. Your data stays private and is safely stored on the cloud."
             },
             {
               q: "Can I Add my Company Logo?",
               a: "Yes. You can upload your logo by clicking on the logo box from the top right corner. You can upload both .jpg and .png format for the logo image."
             },
             {
               q: "Why is an invoice maker free?",
               a: "We want to enable easy transactions for Freelancers, Service Agencies and Small Businesses. We make revenue through Refrens marketplace."
             },
             {
               q: "Why Refrens free invoice generator is best?",
               a: "Refrens is a top-tier free invoice generator because it provides a comprehensive, no-cost business solution. You create and send invoices to clients without paying any amount. The tool offers total customization, letting you adjust fields and columns freely. Refrens gives you flexible sharing options like to download the invoice as a PDF or send it directly via email or WhatsApp."
             }
           ].map((faq, i) => (
              <details key={`faq-${i}`} className="group bg-white border border-slate-200 rounded-2xl [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-6 text-slate-900 font-bold">
                  <h4 className="text-lg">{faq.q}</h4>
                  <span className="shrink-0 rounded-full bg-slate-50 p-2 text-slate-900 group-open:-rotate-180 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 20 20" fill="currentColor">
                       <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-slate-600 text-lg leading-relaxed">
                  {faq.a}
                </div>
              </details>
           ))}
        </div>
      </div>
    </section>
  );
};

export default InvoiceSEO;
