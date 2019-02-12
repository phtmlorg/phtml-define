import phtml from 'phtml';
import transform from './lib/transform';

export default new phtml.Plugin('phtml-define', opts => root => transform(root, Object.assign({ cache: {} }, opts)));
