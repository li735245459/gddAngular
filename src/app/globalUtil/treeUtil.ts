export class TreeUtil {
  /**
   * eui-treegrid
   * @param data(json数组对象)
   * @returns {any}
   */
  getTreeGridData(data): any {
    if (data && data.length > 0) {
      for (let i = 0; i < data.length - 1; i++) {
        for (let j = 0; j < data.length - 1 - i; j++) {
          if (data[i].parentId === data[j + 1 + i].id) {
            if (data[j + 1 + i].children == null) {
              data[j + 1 + i].children = [];
            }
            const temp = data[i];
            data[j + 1 + i].children.push(temp);
            data[i] = null;
            break;
          }
        }
      }
      data = data.filter(item => {
        if (item) {
          // if (item.parentId === 'root' && item.children) {
          //   item.state = 'closed';
          // }
          return true;
        } else {
          return false;
        }
      });
      return data;
    }
    return [];
  }

  /**
   * eui-tree
   * @param data(json数组对象)
   * @returns {any}
   */
  getTreeData(data): any {
    if (data && data.length > 0) {
      for (let i = 0; i < data.length - 1; i++) {
        for (let j = 0; j < data.length - 1 - i; j++) {
          if (data[i].parentId === data[j + 1 + i].id) {
            if (data[j + 1 + i].children == null) {
              data[j + 1 + i].children = [];
            }
            data[i].text = data[i].name;
            const temp = data[i];
            data[j + 1 + i].children.push(temp);
            data[i] = null;
            break;
          }
        }
      }
      data = data.filter(item => {
        if (item) {
          // if (item.parentId === 'root' && item.children) {
          //   item.state = 'closed';
          // }
          item.text = item.name;
          return true;
        } else {
          return false;
        }
      });
      return data;
    }
    return [];
  }
}
