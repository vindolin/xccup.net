<template>
  <div :id="`comment-${comment.id}`" data-cy="flight-comment">
    <div class="d-flex mb-2" data-cy="comment-header">
      <img :src="avatarUrl" class="rounded-circle" />
      <!-- TODO: Insert link -->
      <a href="#" :class="userPrefersDark ? 'link-light' : ''">{{
        comment.user.firstName + " " + comment.user.lastName
      }}</a>
      <span
        class="ms-auto fw-light"
        :class="userPrefersDark ? 'text-light' : 'text-secondary'"
        ><BaseDate :timestamp="comment.createdAt" date-format="dd.MM.yyyy"
      /></span>
    </div>
    <p
      v-if="!showCommentEditor"
      class="allow-white-spaces"
      data-cy="comment-body"
      v-html="commentWithLinks"
    ></p>

    <!-- Replies -->
    <div
      v-for="reply in comment.replies"
      :key="reply.id"
      class="shadow-sm rounded p-3 mb-3"
      :class="userPrefersDark ? 'dark-reply' : ''"
    >
      <CommentReply :reply="reply" />
    </div>
    <!-- Comment Editor -->
    <div v-if="showCommentEditor">
      <CommentInlineEditor
        :textarea-content="editedComment"
        :use-edit-labels="true"
        @save-message="onSaveEditedMessage"
        @close-editor="closeCommentEditor"
      />
    </div>

    <!-- Reply comment editor -->
    <div v-if="showReplyEditor">
      <CommentInlineEditor
        :textarea-content="replyMessage"
        @save-message="onSubmitReplyMessage"
        @close-editor="closeReplyEditor"
      />
    </div>
    <div data-cy="comment-footer">
      <div
        v-if="getUserId && comment.userId != getUserId"
        class="text-secondary text-end"
      >
        <a href="#" @click.prevent="openReplyEditor"
          ><i class="bi bi-reply"></i> Antworten</a
        >
      </div>
      <div
        v-if="comment.userId === getUserId && !showCommentEditor"
        class="text-secondary text-end"
      >
        <a href="#" @click.prevent="onEditComment"
          ><i class="bi bi-pencil-square mx-1"></i>Bearbeiten</a
        >
        <a href="#" @click.prevent="deleteCommentModal.show()">
          <i class="bi bi-trash mx-1"></i>Löschen
        </a>
      </div>
    </div>
  </div>

  <BaseModal
    modal-title="Kommentar löschen?"
    confirm-button-text="Löschen"
    :modal-id="comment.id"
    :confirm-action="onDeleteComment"
    :is-dangerous-action="true"
  />
</template>

<script setup>
import useUser from "@/composables/useUser";
import useComments from "@/composables/useComments";
import { ref, onMounted, computed } from "vue";
import { Modal } from "bootstrap";
import { createUserPictureUrl } from "../helper/profilePictureHelper";
import { sanitizeComment } from "../helper/utils";

const { getUserId } = useUser();
const { deleteComment, editComment, submitComment } = useComments();

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
});

const commentWithLinks = computed(() => sanitizeComment(props.comment.message));

const avatarUrl = createUserPictureUrl(props.comment.user.id);

// Find a way to make this reactive
const userPrefersDark = ref(
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
);

// Modal
const deleteCommentModal = ref(null);
onMounted(() => {
  deleteCommentModal.value = new Modal(
    document.getElementById(props.comment.id)
  );
});

// Delete comment
const onDeleteComment = async () => {
  try {
    const res = await deleteComment(props.comment.id);
    if (res.status != 200) throw res.statusText;
    deleteCommentModal.value.hide();
  } catch (error) {
    console.log(error);
  }
};

// Edit Comment
const showCommentEditor = ref(false);
const editedComment = ref(props.comment.message);

const onEditComment = () => (showCommentEditor.value = true);
const onSaveEditedMessage = async (message) => {
  const comment = {
    message: message,
    userId: getUserId.value,
    id: props.comment.id,
  };
  try {
    const res = await editComment(comment);
    if (res.status != 200) throw res.statusText;
    closeCommentEditor();
  } catch (error) {
    console.log(error);
  }
};

const closeCommentEditor = () => {
  showCommentEditor.value = false;
  editedComment.value = props.comment.message;
};

// Submit new reply
const replyMessage = ref("");
const showReplyEditor = ref(false);

const openReplyEditor = () => (showReplyEditor.value = true);

const onSubmitReplyMessage = async (message) => {
  const comment = {
    message: message,
    userId: getUserId.value,
    relatedTo: props.comment.id,
  };
  try {
    const res = await submitComment(comment);
    if (res.status != 200) throw res.statusText;
    closeReplyEditor();
  } catch (error) {
    console.log(error);
  }
};

const closeReplyEditor = () => {
  showReplyEditor.value = false;
  replyMessage.value = "";
};
</script>
<style lang="scss" scoped>
@import "@/styles/style";
// Not yet perfect, but we're getting there…
.dark-reply {
  background-color: tint-color($primary, 5);
}
.rounded-circle {
  margin-right: 6px;
  height: 24px;
  width: 24px;
}
</style>
