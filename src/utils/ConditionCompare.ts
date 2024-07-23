// 流程条件比较设置选项
export const CompareOptions: any = {
  number: [
    { name: '大于', symbol: 'GT' },
    { name: '小于', symbol: 'LT' },
    { name: '等于', symbol: 'EQ' },
    { name: '大于等于', symbol: 'GT_EQ' },
    { name: '小于等于', symbol: 'LT_EQ' },
    { name: '不等于', symbol: 'NEQ' },
    { name: '包含在', symbol: 'IN' },
    { name: '介于两者间', symbol: 'BT' },
  ],
  string: [
    { name: '含有字符串', symbol: 'HAS' },
    { name: '包含在', symbol: 'IN' },
    { name: '等于', symbol: 'EQ' },
    { name: '不等于', symbol: 'NEQ' },
  ],
  array: [
    { name: '含有', symbol: 'HAS' },
    { name: '不含有', symbol: 'NHAS' },
  ],
  date: [
    { name: '在之前<', symbol: 'BF' },
    { name: '在之后>', symbol: 'AF' },
    { name: '在之间', symbol: 'CT' },
    { name: '在之外', symbol: 'NCT' },
  ],
  dateRange: [
    { name: '在本期间', symbol: 'CT' },
    { name: '在本期间外', symbol: 'NCT' },
    { name: '时长大于', symbol: 'GE' },
    { name: '时长小于', symbol: 'LE' },
    { name: '时长等于', symbol: 'EQ' },
  ],
  org: [
    { name: '本人/部门属于', symbol: 'IN' },
    { name: '本人/部门不属于', symbol: 'NIN' },
  ],
  role: [
    { name: '拥有角色', symbol: 'HAS' },
    { name: '没有角色', symbol: 'NHAS' },
  ],
}

// 流程条件支持对象
export const ProcessCondition: any = {
  INITIATOR: {
    Org: {
      type: 'org',
      desc(cd: any) {
        return `发起人${getCdName(cd)} ${(cd.compareVal || []).map((v: any) => v.name).join('、')}`
      },
    },
    Role: {
      type: 'role',
      desc(cd: any) {
        return `发起人${getCdName(cd)} ${cd.compareVal.map((v: any) => v.name).join('、')}`
      },
    },
  },
  FORM: {
    TextInput: {
      type: 'string',
      desc(cd: any) {
        return `${cd.name[1]} ${getCdName(cd)} ${cd.compareVal.join('、')}`
      },
    },
    NumberInput: {
      type: 'number',
      desc(cd: any) {
        return `${cd.name[1]} ${getCdName(cd)} ${cd.compareVal.join('、')}`
      },
    },
  },
}

function getCdName(cd: any) {
  const options: any = CompareOptions[ProcessCondition[cd.group][cd.type].type]
  const index = options.findIndex((v: any) => v.symbol === cd.compare)
  return (options[index] || {}).name || '?'
}
