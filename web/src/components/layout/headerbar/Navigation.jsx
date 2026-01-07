/*
Copyright (C) 2025 QuantumNous
*/

import React from 'react';
import { Link } from 'react-router-dom';
import SkeletonWrapper from '../components/SkeletonWrapper';

const Navigation = ({
  mainNavLinks,
  isMobile,
  isLoading,
  userState,
  pricingRequireAuth,
}) => {
  const renderNavLinks = () => {
    // 基础样式
    const baseClasses =
      'flex-shrink-0 flex items-center gap-2 font-bold text-lg rounded-md transition-all duration-200 ease-in-out';
    const hoverClasses =
      'hover:text-semi-color-primary hover:bg-semi-color-fill-0'; // 加了个背景色hover效果
    const spacingClasses = isMobile ? 'p-1' : 'p-2';

    const commonLinkClasses = `${baseClasses} ${spacingClasses} ${hoverClasses}`;

    return mainNavLinks.map((link) => {
      // ========== 修改重点：在这里加上了图片 icon ==========
      const linkContent = (
        <div className='flex items-center'>
          {/* 如果有 icon 就显示图片 */}
          {link.icon && (
            <img
              src={link.icon}
              alt={link.text}
              className='w-5 h-5 mr-1.5 object-contain' // 控制图标大小和间距
            />
          )}
          <span>{link.text}</span>
        </div>
      );
      // =================================================

      if (link.isExternal) {
        return (
          <a
            key={link.itemKey}
            href={link.externalLink}
            target='_blank'
            rel='noopener noreferrer'
            className={commonLinkClasses}
          >
            {linkContent}
          </a>
        );
      }

      let targetPath = link.to;
      if (link.itemKey === 'console' && !userState.user) {
        targetPath = '/login';
      }
      if (link.itemKey === 'pricing' && pricingRequireAuth && !userState.user) {
        targetPath = '/login';
      }

      return (
        <Link key={link.itemKey} to={targetPath} className={commonLinkClasses}>
          {linkContent}
        </Link>
      );
    });
  };

  return (
    <nav className='flex flex-1 items-center gap-1 lg:gap-2 mx-2 md:mx-4 overflow-x-auto whitespace-nowrap scrollbar-hide'>
      <SkeletonWrapper
        loading={isLoading}
        type='navigation'
        count={4}
        width={60}
        height={16}
        isMobile={isMobile}
      >
        {renderNavLinks()}
      </SkeletonWrapper>
    </nav>
  );
};

export default Navigation;
