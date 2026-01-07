/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Input,
  ScrollList,
  ScrollItem,
} from '@douyinfe/semi-ui';
import { API, showError, copy, showSuccess } from '../../helpers';
import { useIsMobile } from '../../hooks/common/useIsMobile';
import { API_ENDPOINTS } from '../../constants/common.constant';
import { StatusContext } from '../../context/Status';
import { useActualTheme } from '../../context/Theme';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import {
  IconGithubLogo,
  IconPlay,
  IconFile,
  IconCopy,
} from '@douyinfe/semi-icons';
import { Link } from 'react-router-dom';
import NoticeModal from '../../components/layout/NoticeModal';
import {
  Moonshot,
  OpenAI,
  XAI,
  Zhipu,
  Volcengine,
  Cohere,
  Claude,
  Gemini,
  Suno,
  Minimax,
  Wenxin,
  Spark,
  Qingyan,
  DeepSeek,
  Qwen,
  Midjourney,
  Grok,
  AzureAI,
  Hunyuan,
  Xinference,
} from '@lobehub/icons';
import { Weight } from 'lucide-react';

const { Text } = Typography;

const Home = () => {
  const { t, i18n } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const actualTheme = useActualTheme();
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const [noticeVisible, setNoticeVisible] = useState(false);
  const isMobile = useIsMobile();
  const isDemoSiteMode = statusState?.status?.demo_site_enabled || false;
  const docsLink = statusState?.status?.docs_link || '';
  const serverAddress =
    statusState?.status?.server_address || `${window.location.origin}`;
  const endpointItems = API_ENDPOINTS.map((e) => ({ value: e }));
  const [endpointIndex, setEndpointIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setEndpointIndex((prev) => (prev + 1) % endpointItems.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [endpointItems.length]);

  const isChinese = i18n.language.startsWith('zh');

  const displayHomePageContent = async () => {
    setHomePageContent(localStorage.getItem('home_page_content') || '');
    const res = await API.get('/api/home_page_content');
    const { success, message, data } = res.data;
    if (success) {
      let content = data;
      if (!data.startsWith('https://')) {
        content = marked.parse(data);
      }
      setHomePageContent(content);
      localStorage.setItem('home_page_content', content);

      // 如果内容是 URL，则发送主题模式
      if (data.startsWith('https://')) {
        const iframe = document.querySelector('iframe');
        if (iframe) {
          iframe.onload = () => {
            iframe.contentWindow.postMessage({ themeMode: actualTheme }, '*');
            iframe.contentWindow.postMessage({ lang: i18n.language }, '*');
          };
        }
      }
    } else {
      showError(message);
      setHomePageContent('加载首页内容失败...');
    }
    setHomePageContentLoaded(true);
  };

  const handleCopyBaseURL = async () => {
    const ok = await copy(serverAddress);
    if (ok) {
      showSuccess(t('已复制到剪切板'));
    }
  };

  useEffect(() => {
    const checkNoticeAndShow = async () => {
      const lastCloseDate = localStorage.getItem('notice_close_date');
      const today = new Date().toDateString();
      if (lastCloseDate !== today) {
        try {
          const res = await API.get('/api/notice');
          const { success, data } = res.data;
          if (success && data && data.trim() !== '') {
            setNoticeVisible(true);
          }
        } catch (error) {
          console.error('获取公告失败:', error);
        }
      }
    };

    checkNoticeAndShow();
  }, []);

  useEffect(() => {
    displayHomePageContent().then();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setEndpointIndex((prev) => (prev + 1) % endpointItems.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [endpointItems.length]);

  const sushiList = [
    { name: 'Sushi 1', src: '/sushi/1.png' },
    { name: 'Sushi 2', src: '/sushi/2.png' },
    { name: 'Sushi 3', src: '/sushi/3.png' },
    { name: 'Sushi 4', src: '/sushi/4.png' },
    { name: 'Sushi 5', src: '/sushi/5.png' },
    { name: 'Sushi 6', src: '/sushi/6.png' },
    { name: 'Sushi 7', src: '/sushi/7.png' },
    { name: 'Sushi 8', src: '/sushi/8.png' },
    { name: 'Sushi 9', src: '/sushi/9.png' },
    { name: 'Sushi 10', src: '/sushi/10.png' },
  ];

  return (
    <>
      {/* 1. 全局背景图 (放在最外层) */}
      <div className='home-background'></div>

      <div className='w-full overflow-x-hidden min-h-screen flex flex-col'>
        <NoticeModal
          visible={noticeVisible}
          onClose={() => setNoticeVisible(false)}
          isMobile={isMobile}
        />

        {homePageContentLoaded && homePageContent === '' ? (
          <div className='flex flex-col items-center justify-center flex-grow px-4 py-20 relative'>
            {/* 2. 毛玻璃方圆框容器 START */}
            <div className='glass-panel flex flex-col items-center justify-center text-center'>
              {/* 标题 */}
              <h1
                className={`text-4xl md:text-5xl font-bold text-semi-color-text-0 mb-4 ${isChinese ? 'tracking-wide' : ''}`}
              >
                {t('欢迎来到')}{' '}
                <span className='shine-text' style={{ color: '#a34ce2ff' }}>
                  {t('寿司喵API站')}
                </span>
              </h1>

              {/* 副标题 */}
              <p className='text-lg text-semi-color-text-0 opacity-80 mb-6 max-w-xl'>
                {t('URL填入：')}
              </p>

              {/* 输入框和复制按钮 */}
              <div className='w-full max-w-md mb-8'>
                <Input
                  readonly
                  value={serverAddress}
                  // 1. 加一个专门的类名：custom-home-input
                  className='!rounded-full custom-home-input'
                  size='large'
                  // 这里的 style 只负责大概的背景，具体的文字样式我们去 css 里写
                  style={{
                    background: '#8a5cf6af',
                    border: '1px solid rgba(255, 255, 255, 1)',
                  }}
                  suffix={
                    <div className='flex items-center gap-2'>
                      <div className='hidden md:block'>
                        <div className='gold-text-wrapper'>
                          <ScrollList
                            bodyHeight={32}
                            // 2. 给滚动列表也加一个类名：custom-scroll-suffix
                            className='custom-scroll-suffix'
                            style={{
                              border: 'unset',
                              boxShadow: 'unset',
                              background: 'transparent',
                            }}
                          >
                            <ScrollItem
                              mode='wheel'
                              cycled={true}
                              list={endpointItems}
                              selectedIndex={endpointIndex}
                              onSelect={({ index }) => setEndpointIndex(index)}
                            />
                          </ScrollList>
                        </div>
                      </div>

                      <div className='h-4 w-[1px] bg-white/20 hidden md:block'></div>

                      <Button
                        theme='solid'
                        type='primary'
                        onClick={handleCopyBaseURL}
                        icon={<IconCopy />}
                        className='!rounded-full'
                        style={{ marginRight: 2 }}
                      />
                    </div>
                  }
                />
              </div>

              {/* 按钮组 */}
              <div className='flex gap-4 justify-center'>
                <Link to='/console'>
                  <Button
                    theme='solid'
                    type='primary'
                    size='large'
                    className='!rounded-2xl px-8 shadow-lg'
                    style={{
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    }} // 渐变色按钮
                  >
                    {t('立即注册')}
                  </Button>
                </Link>

                {docsLink && (
                  <Button
                    theme='light'
                    size='large'
                    className='!rounded-2xl px-8 shadow-sm'
                    style={{
                      background: '#d54747ff',
                      color: 'white',
                    }}
                    onClick={() => window.open(docsLink, '_blank')}
                  >
                    {t('购前必读')}
                  </Button>
                )}
              </div>
            </div>
            {/* 毛玻璃方圆框容器 END */}

            {/* 3. 寿司图标区域 */}
            <div className='mt-8 w-full max-w-4xl'>
              <div className='text-center mb-6'>
                <Text
                  type='primary'
                  className='text-xl font-bold'
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                >
                  {t('欢迎品尝！！')}
                </Text>
              </div>

              {/* 图标网格 */}
              <div className='flex flex-wrap items-center justify-center gap-6 md:gap-8'>
                {sushiList.map((item, index) => (
                  <div
                    key={index}
                    title={item.name}
                    className='transition-all duration-300 hover:-translate-y-2'
                  >
                    {/* 这里引用你的本地寿司图片 */}
                    <img
                      src={item.src}
                      alt={item.name}
                      className='sushi-icon'
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // 这里是加载自定义 HTML 的逻辑，保持不变，但加了容器防止背景错乱
          <div className='w-full min-h-screen'>
            {homePageContent.startsWith('https://') ? (
              <iframe
                src={homePageContent}
                className='w-full h-screen border-none'
              />
            ) : (
              <div
                className='mt-[60px] p-4 glass-panel mx-auto'
                dangerouslySetInnerHTML={{ __html: homePageContent }}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
