<template>
  <div>
    <!-- 上传组件 -->
    <el-upload
      ref="uploadRef"
      action=""
      :before-upload="handleBeforeUpload"
      :http-request="uploadImage"
    >
      <el-button type="primary">选择文件</el-button>
      <template #tip>
        <div class="el-upload__tip">仅限xlsx、xls文件</div>
      </template>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  ElMessage,
  ElUpload,
  UploadRawFile,
  UploadRequestOptions
} from 'element-plus';
import { uploadFile, deleteFile } from '@/api/system/file';

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  fileType: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 0
  }
});

const fileUrl = computed<string | undefined>({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  }
});

/**
 * 自定义图片上传
 *
 * @param params
 */
async function uploadImage(options: UploadRequestOptions): Promise<any> {
  const response = await uploadFile(options.file);
  fileUrl.value = response.data;
}

/**
 * 删除图片
 *
 * @param fileUrl
 */
function handleRemove(fileUrl?: string) {
  if (fileUrl) {
    deleteFile(fileUrl);
    // fileUrl.value = undefined; // 这里会触发imgUrl的computed的set方法
  }
}
/**
 * 在 before-upload 钩子中限制用户上传文件的格式和大小
 */
function handleBeforeUpload(file: UploadRawFile) {
  const extension = file.name.split('.')[file.name.split('.').length - 1];
  if (extension !== 'xls' && extension !== 'xlsx') {
    ElMessage.warning('只能上传excel的文件');
    return false;
  }
  if (props.size > 0 && file.size / 1024 > props.size) {
    ElMessage.warning('文件大小不能超过' + props.size + 'KB');
    return false;
  }
  return true;
}
</script>
