'use client';

import React, { Fragment, ReactNode, ComponentType, useState, useEffect } from 'react';
import LandingHeader from '../components/Header/LandingHeader';
import LandingFooter from '../components/Footer/LandingFooter';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  DashboardOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';

const { Header, Sider, Content } = Layout;

interface AppWrapperProps {
  children: ReactNode;
}

interface AppWrapperHOCProps {
  [key: string]: any; // For props passed to the wrapped component
}

function AppWrapperHOC<T extends object>(WrappedComponent: ComponentType<T>) {
  // This HOC component wraps a given component with a header and footer layout
  return function AppWrapper(props: AppWrapperHOCProps) {
    const [collapsed, setCollapsed] = useState(false);

    // return (
      //   <Fragment>
      //     <LandingHeader />
      //     <WrappedComponent {...this.props as T} />
      //     <LandingFooter />
      //   </Fragment>
      // );
    return (
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={[
              {
                key: '1',
                icon: <DashboardOutlined/>,
                label: 'Dashboard',
              },
              {
                key: '2',
                icon: <VideoCameraOutlined />,
                label: 'Test Chatbots',
              },
              {
                key: '3',
                icon: <UploadOutlined />,
                label: 'Conversations',
              },
              {
                key: '4',
                icon: <UploadOutlined />,
                label: 'Integrations',
              },
              {
                key: '5',
                icon: <UploadOutlined />,
                label: 'Resources',
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header 
          // style={{ padding: 0, background: theme.useToken().colorBgContainer }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              // background: theme.useToken().colorBgContainer,
              // borderRadius: theme.useToken().borderRadiusLG,
            }}
          >
            <WrappedComponent {...(props as T)} />
          </Content>
        </Layout>
      </Layout>
    );
  };
}

const AppWrapperLayout: React.FC<AppWrapperProps> = ({ children }) => {
  useEffect(() => {
    // Perform some API calls or initialization logic
    return () => {
      // Perform any necessary cleanup, e.g., clearing timeouts
    };
  }, []);

  return <Fragment>{children}</Fragment>;
};

export { AppWrapperHOC, AppWrapperLayout };
