// api/controllers/securityController.js
import fs from 'fs';
import ZAP from 'zaproxy';

const zapOptions = {
    apiKey: 'l92tpb2ke03p4jq1kv6usucdmc',
    proxy: {
        address: '192.168.1.4',
        port: 8080,
    },
    timeout: 10000 // 10 seconds
};

const zap = new ZAP(zapOptions);


const generateReport = async () => {
    try {
        const reportHtml = await zap.core.htmlreport();
        fs.writeFileSync('zap_report.html', reportHtml);
        console.log('HTML report generated:', reportHtml);
        return 'zap_report.html';
    } catch (error) {
        console.error('Error generating report:', error);
        return null;
    }
};

export const generateZAPFile = async (req, res) => {
    const { targetUrl } = req.body;
    if (!targetUrl) {
        return res.status(400).send('Target URL is required');
    }

    try {

        await zap.spider.scan(targetUrl);
        console.log('Spider scan initiated...');

        await zap.spider.waitForStatus();

        await zap.ascan.scan(targetUrl);
        console.log('Active scan initiated...');

        await zap.ascan.waitForStatus();

        await zap.pscan.scan();
        console.log('Passive scan completed');

        await zap.pscan.waitForStatus()

        await zap.ajaxSpider.scan(targetUrl);
        console.log('AJAX Spider scan completed');

        await zap.ajaxSpider.waitForStatus()


        const reportFile = await generateReport();
        if (!reportFile) {
            return res.status(500).send('Error generating security testing file');
        }
        

        // Check for vulnerabilities
        const vulnerabilities = await zap.core.vulnerabilities();
        console.log('Vulnerabilities found:', vulnerabilities);

        return res.status(200).send('Security testing file generated successfully');
    } catch (error) {
        console.error('Error generating security testing file:', error);
        return res.status(500).send('Error generating security testing file');
    } finally {
        await zap.core.shutdown();
        console.log('ZAP shutdown completed.');
    }
};

