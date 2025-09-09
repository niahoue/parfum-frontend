import React from 'react';
import { cn } from '../../utils/cn'; 

const Tabs = ({ children }) => {
  return (
    <div className="tabs">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { className: cn(child.props.className, 'tab') })
      )}
    </div>
  );
};

const TabsList = ({ children }) => {
  return (
    <div className="tabs-list">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { className: cn(child.props.className, 'tab-list-item') })
      )}
    </div>
  );
};

const TabsContent = ({ children }) => {
  return (
    <div className="tabs-content">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { className: cn(child.props.className, 'tab-content') })
      )}
    </div>
  );
};

const TabsTrigger = ({ children, onClick }) => {
  return (
    <button className="tabs-trigger" onClick={onClick}>
      {children}
    </button>
  );
};

export { Tabs, TabsList, TabsContent, TabsTrigger };