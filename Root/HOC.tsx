'use client';

import React, { Fragment, ReactNode, ComponentType, useState, useEffect } from 'react';
import LandingHeader from '../components/Header/LandingHeader';
import LandingFooter from '../components/Footer/LandingFooter';
import { useRouter } from 'next/navigation';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  DashboardOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, MenuProps, ConfigProvider  } from 'antd';

const { Header, Sider, Content } = Layout;

interface AppWrapperProps {
  children: ReactNode;
}

interface AppWrapperHOCProps {
  // [key: string]: any; // For props passed to the wrapped component
}

function AppWrapperHOC<T extends object>(WrappedComponent: ComponentType<T>) {
  // This HOC component wraps a given component with a header and footer layout
  return function AppWrapper(props: T) {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState('/');

    const {
      token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // return (
      //   <Fragment>
      //     <LandingHeader />
      //     <WrappedComponent {...this.props as T} />
      //     <LandingFooter />
      //   </Fragment>
      // );
      const router = useRouter(); // useRouter hook from Next.js

      const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
        // Use router.push() for programmatic navigation
        router.push(key as string); // Cast key to string
        console.log('selected', key as string)
        console.log('selectedkey', selectedKey)
        setSelectedKey(key as string); // Update the selected key on click
      };

    return (
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div 
          style={{ 
            padding: 0, 
            background: 'rgba(255, 255, 255, 0.5)',  // Light transparent white
            // background: theme.useToken().colorBgContainer
            height: '34px',
            margin: '16px',
            borderRadius: '6px',
         }} > Hello AI World </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick}
            items={[
              {
                key: '/',
                icon: <DashboardOutlined/>,
                label: 'Dashboard',
              },
              {
                key: '/createchatbot',
                icon: <VideoCameraOutlined />,
                label: 'Create Chatbots',
              },
              {
                key: '/testchatbot',
                icon: <VideoCameraOutlined />,
                label: 'Test Chatbots',
              },
              {
                key: '/chatbotmessages',
                icon: <UploadOutlined />,
                label: 'Conversations',
              },
              {
                key: '/integrations',
                icon: <UploadOutlined />,
                label: 'Integrations',
              },
              {
                key: '/resources',
                icon: <UploadOutlined />,
                label: 'Resources',
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header 
          style={{ 
            padding: 0, 
          // background: theme.useToken().colorBgContainer
         }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
                color: '#fff',
                padding: 0
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

  return (
    <ConfigProvider
    theme={{
      token: {
        // Seed Token
        colorPrimary: '#00b96b',
        borderRadius: 2,

        // Alias Token
        colorBgContainer: '#f6ffed',
      },
    }}
  >
  <Fragment>
    {children}
  </Fragment>
  </ConfigProvider>
  );
};

export { AppWrapperHOC, AppWrapperLayout };
