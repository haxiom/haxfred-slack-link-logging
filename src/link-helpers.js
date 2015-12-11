import {
  find,
} from 'lodash';

const LINK_REGEX = '(\\s|^)<(https?:\/\/[^\\s]*\\.[^\\s]+)>(\\s|$)';

export function parseLink (message, options) {
  let linkRegex = new RegExp(`(^.*)${LINK_REGEX}(.*$)`);
  let pieces = message.match(linkRegex);

  if (!pieces) return false;

  let link = _extractLink(pieces, options);

  if (!link) return false;

  let comment = _extractComment(pieces);
  let type = _determineLinkType(link);

  return {
    link,
    comment,
    type,
  };
}

function _extractLink (pieces, options = {}) {
  let link = pieces[3];
  let ignoreLink = _checkDomainBlacklist(link, options.blacklist);

  if (ignoreLink) return false;

  return link;
}

function _determineLinkType (link) {
  link = link.toLowerCase();

  if (link.match(/(gif|jpe?g|png)$/)) return 'image';

  if (link.match(/^https?:\/\/(www\.)?youtu(\.be|be\.com)/)) return 'youtube';

  if (link.match(/^https?:\/\/(www\.)?vimeo.com/)) return 'vimeo';

  return 'article';
}

function _extractComment (pieces) {
  let beforeComment = pieces[1];
  let afterComment = pieces[5];

  if (beforeComment && afterComment) {
    return pieces[0];
  }

  let comment = `${beforeComment}${afterComment}`;

  return comment;
}

function _checkDomainBlacklist (link, blacklist = []) {
  let ignoreDomain = find(blacklist, (domain) => {
    let containsDomain = link.indexOf(domain) > -1;

    return containsDomain;
  });

  return ignoreDomain;
}
