let jsonResponse = {
  services: [
    {
      id: 1,
      head: null,
      name: "Проф.осмотр",
      node: 0,
      price: 100.0,
      sorthead: 20,
    },
    {
      id: 2,
      head: null,
      name: "Хирургия",
      node: 1,
      price: 0.0,
      sorthead: 10,
    },
    {
      id: 3,
      head: 2,
      name: "Удаление зубов",
      node: 1,
      price: 0.0,
      sorthead: 10,
    },
    {
      id: 4,
      head: 3,
      name: "Удаление зуба",
      node: 0,
      price: 800.0,
      sorthead: 10,
    },
    {
      id: 5,
      head: 3,
      name: "Удаление 8ого зуба",
      node: 0,
      price: 1000.0,
      sorthead: 30,
    },
    {
      id: 6,
      head: 3,
      name: "Удаление осколка зуба",
      node: 0,
      price: 2000.0,
      sorthead: 20,
    },
    {
      id: 7,
      head: 2,
      name: "Хирургические вмешательство",
      node: 0,
      price: 200.0,
      sorthead: 10,
    },
    {
      id: 8,
      head: 2,
      name: "Имплантация зубов",
      node: 1,
      price: 0.0,
      sorthead: 20,
    },
    {
      id: 9,
      head: 8,
      name: "Коронка",
      node: 0,
      price: 3000.0,
      sorthead: 10,
    },
    {
      id: 10,
      head: 8,
      name: "Слепок челюсти",
      node: 0,
      price: 500.0,
      sorthead: 20,
    },
  ],
};
const loadTree = (nodes) => {
  for (const node of nodes) {
    createDOMNode(node);
    loadTree(node.childs);
  }
};

const createDOMNode = (node) => {
  let currentNode = document.createElement("div");
  currentNode.id = node.id;
  currentNode.innerText = node.name;

  let revealButton = document.createElement("button");
  revealButton.innerText = "↓";
  revealButton.setAttribute("tag", "reveal-button");
  revealButton.style.marginLeft = "5px";
  if (node.head) {
    let parrentNode = document.getElementById(node.head.id);
    currentNode.style.marginLeft = "10px";
    currentNode.hidden = true;
    revealButton.hidden = true;
    parrentNode.appendChild(currentNode);
  } else {
    revealButton.hidden = false;
    document.getElementById("tree").appendChild(currentNode);
  }

  revealButton.addEventListener("click", () => {
    for (const childNode of currentNode.childNodes) {
      for (const subChildNode of childNode.childNodes) {
        if (subChildNode.tagName == "BUTTON" && subChildNode.hidden) {
          subChildNode.hidden = false;
        }
      }
      if (childNode.hidden) {
        childNode.hidden = false;
      } else {
        if (childNode.tagName != "BUTTON") {
          childNode.hidden = true;
        }
      }
    }
  });
  if (node.isRoot) {
    currentNode.setAttribute("tag", "parent");
    currentNode.appendChild(revealButton);
  }
};

class Node {
  constructor(id, name, head, isRoot, sortHead) {
    this.id = id;
    this.name = name;
    this.head = head;
    this.isRoot = isRoot;
    this.childs = [];
    this.sortHead = sortHead;
  }

  static listFromServices(services) {
    let checkedNodes = [];
    let nodesList = [];
    for (const service of services) {
      let nodeName = null;
      if (!service.price) {
        nodeName = service.name;
      } else {
        nodeName = `${service.name} (${service.price})`;
      }
      let currentNode = new Node(
        service.id,
        nodeName,
        null,
        Boolean(service.node),
        service.sorthead,
      );
      checkedNodes.push(currentNode);
      if (service.head) {
        for (const checkedNode of checkedNodes) {
          if (checkedNode.id == service.head) {
            currentNode.head = checkedNode;
            checkedNode.childs.push(currentNode);
          }
        }
        continue;
      }
      nodesList.push(currentNode);
    }

    return nodesList;
  }
}

const sortNodes = (nodesList) => {
  let sortedNodes = nodesList.slice().sort((aNode, bNode) => {
    return aNode.sortHead - bNode.sortHead;
  });
  for (const node of sortedNodes) {
    if (node.childs.length) {
      node.childs = sortNodes(node.childs.slice());
    }
  }
  return sortedNodes;
};

loadTree(sortNodes(Node.listFromServices(jsonResponse.services)));
