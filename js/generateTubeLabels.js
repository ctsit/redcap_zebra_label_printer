const RZLP = ExternalModules.RZLP.ExternalModule;
import ZebraBrowserPrintWrapper from 'zebra-browser-print-wrapper-v2';


$(document).ready(function () {
    const module = RZLP;
    const GEN_LABEL_BUTTON_ID = 'gen-bio-labels';
    const TEST_PRINT_BUTTON_ID = 'test-print-bio-labels';
    const GEN_HELP_BUTTON_ID = 'help-bio-labels';
    const { tagId, hasMultipleTags, zebraLabelGenFieldId, ptidFieldId, visitNumFieldId, tagValue } = module.tt('emData');
    const zebraLabelPrintHelpUrl = module.tt('zebraLabelPrintHelpUrl')

    if (hasMultipleTags) {
        const alert_multiple_tags = module.tt('alert_multiple_tags');
        alert(alert_multiple_tags);
    }

    const $zebraLabelGenTd = $(`#${zebraLabelGenFieldId}-tr > td:last-child`);
    const $ptidInputField = $(`#${ptidFieldId}-tr td:nth-child(2) input`);
    const $visitNumInputField = $(`#${visitNumFieldId}-tr td:nth-child(2) input`);
    const btn_generate_labels = module.tt('btn_generate_labels');
    const btn_test_print = module.tt('btn_test_print');
    const btn_printing_help = module.tt('btn_printing_help');

    // Append the "Generate biospecimen labels" button
    $zebraLabelGenTd.append(
        $('<button />')
            .html(btn_generate_labels)
            .attr({
                type: 'button',
                id: GEN_LABEL_BUTTON_ID,
                class: 'btn btn-info btn-sm',
                'aria-label': btn_generate_labels
            })
            .prop('disabled', true)
    );

    // Append the "Test print" button only when the action tag value is "test"
    if (tagValue === 'test') {
        $zebraLabelGenTd.append(
            $('<button />')
                .html(btn_test_print)
                .attr({
                    type: 'button',
                    id: TEST_PRINT_BUTTON_ID,
                    class: 'btn btn-secondary btn-sm',
                    'aria-label': btn_test_print
                })
                .prop('disabled', true)
        );
    }

    // Append the "REDCap Zebra Label Printer help icon"
    $zebraLabelGenTd.append(
        $('<i />')
            .addClass('fas fa-question-circle')
            .attr({
                id: GEN_HELP_BUTTON_ID,
                title: btn_printing_help,
                'aria-label': btn_printing_help
            })
    );

    const $genLabelButton = $(`#${GEN_LABEL_BUTTON_ID}`);
    const $testPrintButton = $(`#${TEST_PRINT_BUTTON_ID}`);
    const $helpButton = $(`#${GEN_HELP_BUTTON_ID}`);

    // Event listener for help button click
    $helpButton.on('click', function () {
        // Disable scrolling on the body when the overlay is open
        $('body').css('overflow', 'hidden');

        const btn_close = module.tt('btn_close');

        // Create the overlay element
        const $overlay = $('<div />')
            .attr('id', 'helpOverlay')
            .html(`<div id="overlayContent">
            <button id="closeOverlay" aria-label="${btn_close}"><i class="fa-duotone fa-solid fa-circle-xmark"></i></button>
            <iframe src="${zebraLabelPrintHelpUrl}" width="100%" height="100%" frameborder="0"></iframe>
            </div>
        `);

        // Append the overlay to the body
        $('body').append($overlay);

        const closeOverlay = () => {
            $('#helpOverlay').remove();
            $('body').css('overflow', 'auto'); // Re-enable scrolling when closed
        };

        // Close the overlay on button click
        $('#closeOverlay').on('click', closeOverlay);

        // Close overlay when clicking outside the content
        $('#helpOverlay').on('click', function (e) {
            if ($(e.target).attr('id') === 'helpOverlay') {
                closeOverlay();
            }
        });

        // Close overlay on escape key press
        $(document).on('keydown', function (e) {
            if (e.key === 'Escape') {
                closeOverlay();
            }
        });
    });

    const handleOnFieldChange = () => {
        // if ptid and visit num have values then enable the buttons
        const enabled = !!($ptidInputField.val() && $visitNumInputField.val());
        $genLabelButton.prop('disabled', !enabled);
        $testPrintButton.prop('disabled', !enabled);
    };

    // Attach input listeners for ptid and visit num field
    $ptidInputField.on('input', () => handleOnFieldChange());
    $visitNumInputField.on('input', () => handleOnFieldChange());

    // Call function to enable/disable the button on load
    handleOnFieldChange();

    const handlePrintClick = async ($button, buttonLabel, testPrint = false) => {
        try {
            const ptid = $ptidInputField.val();
            const visitNum = $visitNumInputField.val();
            const btn_generating = module.tt('btn_generating');

            // Disable both buttons to prevent concurrent print jobs
            $genLabelButton.prop('disabled', true);
            $testPrintButton.prop('disabled', true);

            // Show loading spinner on the clicked button
            $button.text(`${btn_generating}… `).append('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');

            // Make an ajax call to generate labels
            const response = await RZLP.ajax("generateTubeLabels", { ptid, visit_num: visitNum });
            let labels = JSON.parse(response);

            if (testPrint) {
                // Keep only the first label of each type (one per sample type)
                const seenTypes = new Set();
                labels = labels.filter(item => {
                    if (seenTypes.has(item.type)) return false;
                    seenTypes.add(item.type);
                    return true;
                });
            }

            const zplLabels = labels.map(item => generateZplLabel(item.ptid, item.type, item.barcode_str));
            const zplSheet = zplLabels.join('');

            const { printerCheckStatus, printerStatusDetails } = await printerPreCheck();
            if (printerCheckStatus) {
                const browserPrint = printerStatusDetails;
                const printStatus = await printTubeLabels(zplSheet, browserPrint);
                const alert_printing_failed = module.tt('alert_printing_failed');
                if (!printStatus) {
                    downloadZplFile(zplSheet);
                    alert(alert_printing_failed);
                }
            } else {
                alert(printerStatusDetails);
                return;
            }
        } catch (error) {
            const alert_error_generating = module.tt('alert_error_generating');
            console.error('Error generating labels:', error);
            alert(alert_error_generating);
        } finally {
            // Reset the clicked button text and re-enable both buttons
            $button.text(buttonLabel);
            $genLabelButton.prop('disabled', false);
            $testPrintButton.prop('disabled', false);
        }
    };

    // Attach click listener to the "Generate biospecimen labels" button
    $genLabelButton.on('click', () => handlePrintClick($genLabelButton, btn_generate_labels));

    // Attach click listener to the "Test print" button
    $testPrintButton.on('click', () => handlePrintClick($testPrintButton, btn_test_print, true));
});

// Generate ZPL Label
const generateZplLabel = (ptid, type, barcode) => {
    return `^XA
    ^PW380^LL192
    ^FO26,30^A0N,30,24^FD${barcode}^FS
    ^FO32,60^BQN,2,2,Q,7^FDQA,${barcode}^FS
    ^FO94,88^A0N,30,24^FD${ptid} ${type}^FS
    ^FO318,43^BQN,2,2,Q,1^FDQA,${barcode}^FS
    ^XZ`;
};

// Download ZPL File if printing fails
const downloadZplFile = (zplSheet) => {
    const blob = new Blob([zplSheet], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const download_filename = RZLP.tt('download_filename');
    link.download = `${download_filename}.zpl`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Check if everything is set up correctly for printing
const printerPreCheck = async () => {
    try {
        const browserPrint = new ZebraBrowserPrintWrapper();
        // Execute both asynchronous tasks concurrently
        const [printers, defaultPrinter] = await Promise.all([
            browserPrint.getAvailablePrinters(),
            browserPrint.getDefaultPrinter()
        ]);

        const printer_no_zebra_found = RZLP.tt('printer_no_zebra_found');
        if (!printers.length) {
            return {
                printerCheckStatus: false,
                printerStatusDetails: printer_no_zebra_found
            };
        }

        const printer_set_default = RZLP.tt('printer_set_default');
        if (!defaultPrinter) {
            return {
                printerCheckStatus: false,
                printerStatusDetails: printer_set_default
            };
        }

        browserPrint.setPrinter(defaultPrinter);
        const printerStatus = await browserPrint.checkPrinterStatus();
        if (printerStatus.isReadyToPrint === true) {
            return {
                printerCheckStatus: true,
                printerStatusDetails: browserPrint
            };
        } else {
            const printer_unknown_error = RZLP.tt('printer_unknown_error');
            let errorMessage = printer_unknown_error;

            if (printerStatus.errors) {
                console.error("Printer status error:", printerStatus.errors);
                const printer_not_connected = RZLP.tt('printer_not_connected');
                const printer_not_ready_prefix = RZLP.tt('printer_not_ready_prefix');
                const printer_not_ready_suffix = RZLP.tt('printer_not_ready_suffix');

                if (printerStatus.errors === 'Error: Unknown Error') {
                    errorMessage = printer_not_connected;
                } else {
                    errorMessage = `${printer_not_ready_prefix} ${printerStatus.errors}. ${printer_not_ready_suffix}`;
                }
            }
            return { printerCheckStatus: false, printerStatusDetails: errorMessage };
        }
    }
    catch (error) {
        console.error("Error checking printer status:", error);
        const printer_check_zebra_app = RZLP.tt('printer_check_zebra_app');
        const printer_status_unknown = RZLP.tt('printer_status_unknown');

        if (error.message && error.message.includes('Failed to fetch')) {
            return { printerCheckStatus: false, printerStatusDetails: printer_check_zebra_app };
        } else {
            return { printerCheckStatus: false, printerStatusDetails: printer_status_unknown };
        }
    }
};

// Load Zebra Browser Print Wrapper and print the labels
const printTubeLabels = async (zpl, browserPrintObj) => {
    try {
        const alert_printing_labels = RZLP.tt('alert_printing_labels');
        alert(alert_printing_labels);
        await browserPrintObj.print(zpl);
        return true;
    } catch (error) {
        console.error("Printing failed:", error);
        return false;
    }
};
