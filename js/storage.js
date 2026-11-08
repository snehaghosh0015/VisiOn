/* Tiny localStorage wrapper. All keys are namespaced with "ytc:". */
const Store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem("ytc:" + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem("ytc:" + key, JSON.stringify(value));
    } catch (e) {
      /* storage full or disabled — ignore */
    }
  },

  has(key, id) {
    return this.get(key, []).includes(id);
  },

  /** Adds or removes id from a list. Returns true when id is now in the list. */
  toggle(key, id) {
    const list = this.get(key, []);
    const index = list.indexOf(id);
    if (index === -1) list.unshift(id);
    else list.splice(index, 1);
    this.set(key, list);
    return index === -1;
  },

  remove(key, id) {
    this.set(
      key,
      this.get(key, []).filter((x) => x !== id)
    );
  },

  pushHistory(id) {
    const list = this.get("history", []).filter((x) => x !== id);
    list.unshift(id);
    this.set("history", list.slice(0, 50));
  },
};
