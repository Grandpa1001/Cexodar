import React from 'react';

import {PageHOC} from '../components';

const CreateBattle = () => {
  return (
    <div>
        <>Hello from creat battle</>
    </div>
  )
};

export default PageHOC (
  CreateBattle,
  <>Create <br /> a new Battle</>,
  <>Create your own battle and wait for opponent</>
);