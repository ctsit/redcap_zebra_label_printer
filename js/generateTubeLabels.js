const TLG = ExternalModules.TLG.ExternalModule;

$(document).ready(function () {
    const module = TLG;
    const GEN_LABEL_BUTTON_ID = 'gen-bio-labels';
    const { tagId, hasMultipleTags, tubeLabelGenFieldId, ptidFieldId, visitNumFieldId } = module.tt('emData');

    if (hasMultipleTags) {
        alert(`Multiple fields on this form have the ${tagId} tag. The button will only be applied to the first field.`);
    }

    const $tubeLabelGenTd = $(`#${tubeLabelGenFieldId}-tr > td:nth-child(2)`);
    const $ptidInputField = $(`#${ptidFieldId}-tr td:nth-child(2) input`);
    const $visitNumInputField = $(`#${visitNumFieldId}-tr td:nth-child(2) input`);

    // Append the "Generate biospecimen labels button"
    $tubeLabelGenTd.append(
        $('<button />')
            .html('Generate biospecimen labels')
            .css(
                {
                    'margin-top': '5px',
                },
            )
            .attr(
                {
                    type: 'button',
                    id: GEN_LABEL_BUTTON_ID,
                    class: 'btn btn-info btn-sm',
                },
            )
            .prop('disabled', true),

    );

    const $genLabelButton = $(`#${GEN_LABEL_BUTTON_ID}`);

    const handleOnFieldChange = () => {
        // if ptid and visit num have values then enable the button
        if ($ptidInputField.val() && $visitNumInputField.val()) {
            $genLabelButton.prop('disabled', false);
        } else {
            $genLabelButton.prop('disabled', true);
        }
    }

    // Attach input listeners for ptid and visit num field
    $ptidInputField.on('input', () => handleOnFieldChange());
    $visitNumInputField.on('input', () => handleOnFieldChange());

    // Call function to enable/disable the button on load
    handleOnFieldChange();

    // Attach click listener to the "Generate biospecimens label"  button
    $genLabelButton.on('click', () => {
        // Make an ajax call to generate labels
        TLG.ajax("generateTubeLabels", { 'ptid': $ptidInputField.val(), 'visit_num': $visitNumInputField.val() }).then(r => {
            labels = JSON.parse(r);
            zplLabels = [];
            labels.forEach((item, index) => {
                const { ptid, type, barcode_str } = item;
                zplLabels.push(genrateZplLabel(ptid, type, barcode_str));
            });
            zplSheet = zplLabels.reduce((acc, curr) => (acc += curr), "");
            // code from https://gist.github.com/Lakerfield/1b77b03789525c9d0f13ddfeedee2efa
            var printWindow = window.open();
            printWindow.document.open('text/plain')
            printWindow.document.write(zplSheet);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        });
    });
});

const genrateZplLabel = (ptid, type, barcode) => {
    zplLabel = `^XA^PW382^LL190^FO26,30^A0N,30,24^FD${barcode}^FS^FO32,60^BQN,2,2,Q,7^FDQA,${barcode}^FS^FO98,90^A0N,30,24^${ptid} ${type}^FS^FO315,45^BQN,2,2,Q,7^FDQA,${barcode}^FS^XZ`;
    return zplLabel;
};

const downloadMultiLabelPdf = async (zplSheet) => {
    const { PDFDocument } = PDFLib;

    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/pdf");
    myHeaders.append("X-Page-Layout", "5x15");
    myHeaders.append("X-Page-Size", "A4");

    var formdata = new FormData();
    formdata.append("file", zplSheet);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

    try {
        // limits are described on https://labelary.com/service.html
        // Maximum 5 requests per second per client. Additional requests result in a HTTP 429 (Too Many Requests) error.
        // Maximum 50 labels per request. Additional labels result in a HTTP 413 (Payload Too Large) error. See the FAQ for details.
        const response = await fetch("https://api.labelary.com/v1/printers/12dpmm/labels/1.25x.625", requestOptions);
        const blob = await response.arrayBuffer();
        const pdfDoc = await PDFDocument.load(blob);
        const pdfBytes = await pdfDoc.save();

        const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(pdfBlob);
        window.open(url);
    } catch (error) {
        console.log('error', error);
    }
}
