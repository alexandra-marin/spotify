import packageJson from '../../package.json';

export default express => express.route('/version').get((req, res) => {
  res.json({ version: packageJson.version });
});
