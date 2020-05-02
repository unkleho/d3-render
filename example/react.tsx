// import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import render from '../';

const App = () => {
  const svg = React.useRef();
  const [data, setData] = React.useState([
    {
      append: 'rect',
      width: 50,
      height: 50,
      fill: 'green',
      // fill: (datum, index, node) => {
      //   console.log(datum, index, node);

      //   return 'green';
      // },
      duration: 1000,
      onClick: () => {
        setData([{ ...data[0], fill: 'yellow' }]);
      },
    },
  ]);

  React.useEffect(() => {
    if (svg && svg.current) {
      render(svg.current, data);
    }
  }, [data]);

  return <svg ref={svg}></svg>;
};

ReactDOM.render(<App />, document.getElementById('react'));
