
const CACHE_PREFIX = 'HELLO_CACHE';

export const CACHE_KEY = {
  // 用户信息是唯一允许全局的
  USER_INFO: 'GLOBAL_CACHE_USER_INFO',
  // 请用工程名作区分，防止工程间命名冲突
  TEST: `${CACHE_PREFIX}_TEST`
};

export default {};
