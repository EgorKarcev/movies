import React, { useCallback } from 'react';
import { Tabs, Input } from 'antd';
import 'antd/dist/antd.css';
import './Header.css';
import { debounce } from 'lodash';

const useDebounce = (callback, msTime) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const db = useCallback(debounce(callback, msTime), []);
  return db;
};

const Header = ({ searchInput, ratedClick }) => {
  const { TabPane } = Tabs;

  const inputChange = useDebounce((eve) => searchInput(eve), 1000);

  return (
    <div className="movies__header">
      <Tabs centered className="movies__tabs" onChange={(keyTab) => ratedClick(keyTab)}>
        <TabPane tab="Search" key="Search">
          <Input placeholder="Type to search..." onChange={inputChange} />
        </TabPane>
        <TabPane tab="Rated" key="Rated" />
      </Tabs>
    </div>
  );
};

export default Header;
