export interface User {
    id: string;
    name: string;
    position: string;
    deptId: string;
}

export interface Department {
    id: string;
    name: string;
    parentId: string | null;
    children?: Department[];
    // Extended fields
    code?: string;
    sortOrder?: number;
    shortName?: string;
    isActive?: boolean;
    isHrLinked?: boolean;
    isVisible?: boolean;
}

export const departments: Department[] = [
    {
        id: "root",
        name: "진학사",
        parentId: null,
        code: "JINHAK001",
        sortOrder: 1,
        shortName: "진학사",
        isActive: true,
        isHrLinked: true,
        isVisible: true,
        children: [
            {
                id: "dept_support",
                name: "J_지원본부",
                parentId: "root",
                code: "JINHAK12000",
                sortOrder: 10,
                shortName: "J_지원본부",
                isActive: true,
                isHrLinked: true,
                isVisible: true,
                children: [
                    { id: "dept_finance", name: "A_재경실", parentId: "dept_support", code: "FIN001", sortOrder: 1, shortName: "재경실", isActive: true, isHrLinked: true, isVisible: true },
                    { id: "dept_gwp", name: "J_GWP실", parentId: "dept_support", code: "GWP001", sortOrder: 2, shortName: "GWP실", isActive: true, isHrLinked: true, isVisible: true },
                    { id: "dept_plan", name: "J_Business Planning", parentId: "dept_support", code: "PLAN001", sortOrder: 3, shortName: "기획실", isActive: true, isHrLinked: true, isVisible: true },
                ]
            },
            { id: "dept_jinhak", name: "J_진학닷컴사업본부", parentId: "root", code: "JINHAK15000", sortOrder: 20, shortName: "J_진학닷컴사업본부", isActive: true, isHrLinked: true, isVisible: true },
            { id: "dept_catch", name: "J_CATCH사업본부", parentId: "root", code: "JINHAK14000", sortOrder: 30, shortName: "J_CATCH사업본부", isActive: true, isHrLinked: true, isVisible: true },
            { id: "dept_black", name: "J_블랙라벨사업부", parentId: "root", code: "JINHAK13000", sortOrder: 40, shortName: "J_블랙라벨사업부", isActive: true, isHrLinked: true, isVisible: true },
            { id: "dept_ad", name: "J_광고기획팀", parentId: "root", code: "AD001", sortOrder: 50, shortName: "광고기획팀", isActive: true, isHrLinked: true, isVisible: true },
            { id: "dept_apply", name: "A_진학어플라이 법인", parentId: "root", code: "APPLY001", sortOrder: 60, shortName: "어플라이", isActive: true, isHrLinked: true, isVisible: true },
            { id: "dept_security", name: "정보보안", parentId: "root", code: "SEC001", sortOrder: 70, shortName: "정보보안", isActive: true, isHrLinked: true, isVisible: true },
            { id: "dept_eval", name: "심사부", parentId: "root", code: "EVAL001", sortOrder: 80, shortName: "심사부", isActive: true, isHrLinked: true, isVisible: true },
        ]
    }
];

export const users: User[] = [
    { id: "u1", name: "노한준", position: "실장", deptId: "dept_gwp" },
    { id: "u2", name: "강정윤", position: "매니저", deptId: "dept_gwp" },
    { id: "u3", name: "박효진", position: "매니저", deptId: "dept_gwp" },
    { id: "u4", name: "정호영A", position: "매니저", deptId: "dept_gwp" },
    { id: "u5", name: "김휘원", position: "매니저", deptId: "dept_gwp" },
    { id: "u6", name: "안재하", position: "매니저", deptId: "dept_gwp" },

    // Some extras for other depts
    { id: "u7", name: "김철수", position: "팀장", deptId: "dept_finance" },
    { id: "u8", name: "이영희", position: "사원", deptId: "dept_finance" },
];
